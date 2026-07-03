"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { CardBackground, InterviewQuestion, ResumeData, Role, School } from "@/types";
import { questionsForRole } from "@/lib/questions";
import { generateResume, getTemplateRecommendation } from "@/lib/claude";
import { getTemplate } from "@/lib/templates";
import { downloadDocx } from "@/lib/buildDocx";
import {
  createSpeechRecognition,
  ensureVoicesLoaded,
  speak,
  speechRecognitionSupported,
  stopSpeaking,
  type SpeechRecognitionLike,
} from "@/lib/speech";
import { createClient } from "@/lib/supabase/client";
import RolePicker from "@/components/interview/RolePicker";
import InterviewLayout from "@/components/interview/InterviewLayout";
import CloudAnimation, { CloudState } from "@/components/interview/CloudAnimation";
import MicButton from "@/components/interview/MicButton";
import ResumePanel from "@/components/resume/ResumePanel";
import StylePicker from "@/components/resume/StylePicker";
import CardPicker from "@/components/card/CardPicker";
import QRShare from "@/components/card/QRShare";
import { useToast } from "@/components/ui/toast";

type Screen = "role" | "interview" | "style" | "done" | "card" | "qr";

export default function InterviewPage() {
  const [screen, setScreen] = useState<Screen>("role");
  const [role, setRole] = useState<Role | null>(null);
  const [questions, setQuestions] = useState<InterviewQuestion[]>([]);
  const [qIndex, setQIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [transcript, setTranscript] = useState("");
  const [cloudState, setCloudState] = useState<CloudState>("idle");
  const [recording, setRecording] = useState(false);
  const [voiceSupported, setVoiceSupported] = useState(true);
  const [textFallback, setTextFallback] = useState("");
  const [resumeData, setResumeData] = useState<ResumeData | null>(null);
  const [generating, setGenerating] = useState(false);
  const [templateId, setTemplateId] = useState("ats_clean");
  const [recommendation, setRecommendation] = useState<{ templateId: string; reason: string } | null>(null);
  const [savedResumeId, setSavedResumeId] = useState<string | null>(null);
  const [cardBackground, setCardBackground] = useState<CardBackground>({
    type: "preset",
    styleId: "c1",
    color: "#111111",
  });
  const [shareSlug, setShareSlug] = useState<string | null>(null);
  const [school, setSchool] = useState<School | null>(null);

  const recognitionRef = useRef<SpeechRecognitionLike | null>(null);
  const transcriptRef = useRef("");
  const { toast } = useToast();

  useEffect(() => {
    setVoiceSupported(speechRecognitionSupported());
    ensureVoicesLoaded();
    // Load the user's school for card backgrounds
    (async () => {
      const supabase = createClient();
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) return;
      const { data } = await supabase
        .from("profiles")
        .select("school:schools(*)")
        .eq("id", user.id)
        .single();
      const sch = (data as { school: School | null } | null)?.school;
      if (sch) setSchool(sch);
    })();
    return () => {
      stopSpeaking();
      recognitionRef.current?.abort();
    };
  }, []);

  const currentQ = questions[qIndex];

  // ---------- Interview flow ----------

  const startInterview = (r: Role) => {
    setRole(r);
    const qs = questionsForRole(r.id);
    setQuestions(qs);
    setQIndex(0);
    setScreen("interview");
    askQuestion(qs[0]);
  };

  const askQuestion = (q: InterviewQuestion) => {
    setTranscript("");
    setTextFallback("");
    setCloudState("talking");
    speak(q.speak, () => setCloudState("idle"));
  };

  const startRecording = () => {
    stopSpeaking();
    const rec = createSpeechRecognition();
    if (!rec) {
      toast("Voice input not supported — type your answer below", "error");
      return;
    }
    recognitionRef.current = rec;
    transcriptRef.current = "";
    rec.onresult = (event) => {
      let finalText = "";
      let interim = "";
      for (let i = 0; i < event.results.length; i++) {
        const r = event.results[i];
        if (r.isFinal) finalText += r[0].transcript;
        else interim += r[0].transcript;
      }
      transcriptRef.current = finalText || interim;
      setTranscript(transcriptRef.current);
    };
    rec.onerror = () => {
      setRecording(false);
      setCloudState("idle");
    };
    rec.onend = () => {
      setRecording(false);
      setCloudState("idle");
    };
    rec.start();
    setRecording(true);
    setCloudState("listening");
  };

  const stopRecording = () => {
    recognitionRef.current?.stop();
    setRecording(false);
    setCloudState("idle");
  };

  const submitAnswer = useCallback(
    (text: string) => {
      if (!currentQ) return;
      const answer = text.trim();
      if (!answer) return;
      const nextAnswers = { ...answers, [currentQ.key]: answer };
      setAnswers(nextAnswers);
      setTranscript("");
      setTextFallback("");

      if (qIndex + 1 < questions.length) {
        setQIndex(qIndex + 1);
        askQuestion(questions[qIndex + 1]);
      } else {
        finishInterview(nextAnswers);
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [currentQ, answers, qIndex, questions]
  );

  const skipQuestion = () => {
    if (!currentQ) return;
    if (qIndex + 1 < questions.length) {
      setQIndex(qIndex + 1);
      askQuestion(questions[qIndex + 1]);
    } else {
      finishInterview(answers);
    }
  };

  const finishInterview = async (finalAnswers: Record<string, string>) => {
    stopSpeaking();
    setCloudState("thinking");
    setGenerating(true);
    try {
      const [resume, rec] = await Promise.all([
        generateResume(finalAnswers, questions),
        getTemplateRecommendation(finalAnswers).catch(() => null),
      ]);
      setResumeData(resume);
      if (rec) {
        setRecommendation(rec);
        setTemplateId(rec.templateId || "ats_clean");
      }
      setCloudState("done");
      setScreen("style");
    } catch {
      toast("Resume generation failed — please try again", "error");
      setCloudState("idle");
    } finally {
      setGenerating(false);
    }
  };

  // ---------- Save / export ----------

  const saveResume = async (): Promise<string | null> => {
    if (!resumeData) return null;
    if (savedResumeId) return savedResumeId;
    const res = await fetch("/api/resume", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        resumeData,
        rawAnswers: answers,
        roleType: role?.id,
        templateId,
      }),
    });
    if (!res.ok) {
      toast("Failed to save resume", "error");
      return null;
    }
    const json = await res.json();
    setSavedResumeId(json.resume.id);
    toast("Saved to dashboard ✓");
    return json.resume.id as string;
  };

  const confirmStyle = async () => {
    setScreen("done");
    await saveResume();
  };

  const download = async () => {
    if (!resumeData) return;
    await downloadDocx(resumeData, getTemplate(templateId));
    toast("Resume downloaded ✓");
  };

  const makeCard = async () => {
    const resumeId = await saveResume();
    if (!resumeId && !savedResumeId) return;
    setScreen("card");
  };

  const finishCard = async () => {
    const res = await fetch("/api/card", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        resumeId: savedResumeId,
        styleId: cardBackground.styleId ?? "c1",
        backgroundType: cardBackground.type,
        backgroundData: cardBackground,
      }),
    });
    if (res.ok) {
      const json = await res.json();
      setShareSlug(json.card.share_slug);
    } else {
      toast("Failed to save card", "error");
    }
    setScreen("qr");
  };

  // ---------- Screens ----------

  if (screen === "role") {
    return (
      <main className="min-h-screen bg-gray-50">
        <TopBar />
        <RolePicker onSelect={startInterview} />
      </main>
    );
  }

  if (screen === "interview") {
    return (
      <InterviewLayout
        phone={
          <div className="flex w-full flex-1 flex-col items-center justify-between gap-6">
            <div className="w-full text-center">
              <p className="text-xs font-bold uppercase tracking-widest text-gray-300">
                Question {qIndex + 1} / {questions.length}
              </p>
              <div className="mx-auto mt-2 h-1.5 w-40 overflow-hidden rounded-full bg-gray-100">
                <div
                  className="h-full rounded-full bg-gray-900 transition-all"
                  style={{ width: `${((qIndex + 1) / questions.length) * 100}%` }}
                />
              </div>
            </div>

            <CloudAnimation state={cloudState} />

            <h2 className="whitespace-pre-line text-center font-caveat text-3xl font-semibold text-gray-800">
              {currentQ?.short}
            </h2>

            {!voiceSupported && (
              <p className="rounded-xl bg-amber-50 px-4 py-2 text-center text-xs text-amber-700">
                Voice input requires Chrome or Edge on desktop/Android — type instead.
              </p>
            )}

            <p aria-live="polite" className="min-h-[3rem] px-2 text-center text-sm text-gray-500">
              {transcript || "…"}
            </p>

            {voiceSupported ? (
              <MicButton
                recording={recording}
                disabled={generating}
                onClick={recording ? stopRecording : startRecording}
              />
            ) : null}

            <div className="flex w-full flex-col gap-2">
              {transcript && !recording && (
                <button
                  onClick={() => submitAnswer(transcript)}
                  aria-label="Confirm answer"
                  className="w-full rounded-xl bg-gray-900 py-3 text-sm font-bold text-white transition hover:bg-gray-700"
                >
                  That&apos;s right →
                </button>
              )}
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  submitAnswer(textFallback);
                }}
                className="flex gap-2"
              >
                <input
                  value={textFallback}
                  onChange={(e) => setTextFallback(e.target.value)}
                  placeholder="Or type your answer…"
                  aria-label="Type your answer"
                  className="h-10 flex-1 rounded-xl border border-gray-200 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-gray-300"
                />
                <button
                  type="submit"
                  aria-label="Submit typed answer"
                  className="rounded-xl bg-gray-100 px-4 text-sm font-bold text-gray-700 hover:bg-gray-200"
                >
                  ↑
                </button>
              </form>
              <button
                onClick={skipQuestion}
                aria-label="Skip this question"
                className="text-xs font-medium text-gray-300 transition hover:text-gray-500"
              >
                Skip →
              </button>
            </div>
          </div>
        }
        panel={
          <ResumePanel
            data={resumeData}
            answers={answers}
            templateId={templateId}
            generating={generating}
          />
        }
      />
    );
  }

  if (screen === "style") {
    return (
      <main className="min-h-screen bg-gray-50">
        <TopBar />
        <StylePicker
          selected={templateId}
          recommendation={recommendation}
          onSelect={setTemplateId}
        />
        <div className="mx-auto max-w-4xl px-6 pb-12">
          <button
            onClick={confirmStyle}
            aria-label="Confirm template choice"
            className="w-full rounded-xl bg-gray-900 py-3.5 text-sm font-bold text-white transition hover:bg-gray-700"
          >
            Use {getTemplate(templateId).name} →
          </button>
        </div>
      </main>
    );
  }

  if (screen === "done") {
    return (
      <main className="flex min-h-screen flex-col items-center justify-center bg-gray-50 px-6">
        <TopBar />
        <div className="w-full max-w-md space-y-6 text-center">
          <CloudAnimation state="done" />
          <div>
            <h1 className="font-caveat-brush text-4xl text-gray-900">All done! 🎉</h1>
            <p className="mt-2 text-gray-500">
              Your resume is saved to your dashboard.
            </p>
          </div>
          <div className="space-y-3">
            <button
              onClick={download}
              aria-label="Download resume as DOCX"
              className="w-full rounded-xl bg-gray-900 py-3.5 text-sm font-bold text-white transition hover:bg-gray-700"
            >
              ⬇ Download DOCX
            </button>
            <button
              onClick={makeCard}
              aria-label="Make a QR business card"
              className="w-full rounded-xl border-2 border-gray-900 py-3.5 text-sm font-bold text-gray-900 transition hover:bg-gray-100"
            >
              📇 Make my business card
            </button>
            <Link
              href="/dashboard"
              className="block text-sm font-medium text-gray-400 transition hover:text-gray-700"
            >
              Back to dashboard
            </Link>
          </div>
        </div>
      </main>
    );
  }

  if (screen === "card") {
    return (
      <main className="min-h-screen bg-gray-50">
        <TopBar />
        <CardPicker
          defaultSchool={school}
          background={cardBackground}
          onChange={setCardBackground}
          onDone={finishCard}
        />
      </main>
    );
  }

  // screen === "qr"
  return (
    <main className="min-h-screen bg-gray-50">
      <TopBar />
      {resumeData && (
        <QRShare data={resumeData} background={cardBackground} shareSlug={shareSlug} />
      )}
      <div className="pb-12 text-center">
        <Link
          href="/dashboard"
          className="text-sm font-medium text-gray-400 transition hover:text-gray-700"
        >
          Back to dashboard →
        </Link>
      </div>
    </main>
  );
}

function TopBar() {
  return (
    <header className="border-b border-gray-200 bg-white">
      <div className="mx-auto flex max-w-5xl items-center justify-between px-6 py-3">
        <Link href="/dashboard" className="font-caveat-brush text-xl text-gray-900">
          ☁️ VoiceResume
        </Link>
        <Link
          href="/dashboard"
          className="text-sm font-medium text-gray-400 transition hover:text-gray-700"
        >
          Exit
        </Link>
      </div>
    </header>
  );
}
