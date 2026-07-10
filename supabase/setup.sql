-- ============================================================
-- VoiceResume — ONE-SHOT SETUP
-- Supabase Dashboard → SQL Editor → paste this whole file → Run
-- (combines migrations 001 + 002 and creates storage buckets)
-- ============================================================

-- ---------- Tables ----------

CREATE TABLE schools (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name          TEXT NOT NULL,
  short_name    TEXT,
  type          TEXT CHECK (type IN ('university','college','company','organization')),
  country       TEXT DEFAULT 'US',
  colors        JSONB,
  logo_url      TEXT,
  domain        TEXT UNIQUE,
  created_at    TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_schools_name ON schools USING gin(to_tsvector('english', name));

CREATE TABLE profiles (
  id              UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email           TEXT UNIQUE NOT NULL,
  full_name       TEXT,
  avatar_url      TEXT,
  school_id       UUID REFERENCES schools(id),
  graduation_year INT,
  is_graduated    BOOLEAN DEFAULT FALSE,
  created_at      TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE resumes (
  id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id      UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  title        TEXT,
  role_type    TEXT,
  template_id  TEXT NOT NULL DEFAULT 'ats_clean',
  data         JSONB NOT NULL,
  raw_answers  JSONB,
  created_at   TIMESTAMPTZ DEFAULT NOW(),
  updated_at   TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE cards (
  id               UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id          UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  resume_id        UUID REFERENCES resumes(id) ON DELETE SET NULL,
  style_id         TEXT NOT NULL DEFAULT 'c1',
  background_type  TEXT CHECK (background_type IN ('preset','school','drawn','minimal','pattern')),
  background_data  JSONB,
  card_image_url   TEXT,
  vcf_url          TEXT,
  share_slug       TEXT UNIQUE DEFAULT substr(md5(random()::text), 1, 8),
  view_count       INT DEFAULT 0,
  created_at       TIMESTAMPTZ DEFAULT NOW()
);

-- ---------- Row Level Security ----------

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE resumes  ENABLE ROW LEVEL SECURITY;
ALTER TABLE cards    ENABLE ROW LEVEL SECURITY;
ALTER TABLE schools  ENABLE ROW LEVEL SECURITY;

CREATE POLICY "own profile"    ON profiles FOR ALL USING (auth.uid() = id);
CREATE POLICY "own resumes"    ON resumes  FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "own cards"      ON cards    FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "public cards"   ON cards    FOR SELECT USING (share_slug IS NOT NULL);
CREATE POLICY "public schools" ON schools  FOR SELECT USING (true);

-- ---------- Auto-create profile on signup ----------

CREATE OR REPLACE FUNCTION handle_new_user() RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO profiles (id, email, full_name, avatar_url)
  VALUES (NEW.id, NEW.email,
    NEW.raw_user_meta_data->>'full_name',
    NEW.raw_user_meta_data->>'avatar_url');
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users FOR EACH ROW EXECUTE FUNCTION handle_new_user();

-- ---------- Public card view counter ----------

CREATE OR REPLACE FUNCTION increment_card_views(slug TEXT) RETURNS VOID AS $$
BEGIN
  UPDATE cards SET view_count = view_count + 1 WHERE share_slug = slug;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ---------- Realtime (owner gets "someone received your card" toast) ----------

ALTER PUBLICATION supabase_realtime ADD TABLE public.cards;

-- ---------- Storage buckets + policies ----------

INSERT INTO storage.buckets (id, name, public)
VALUES ('card-images', 'card-images', true)
ON CONFLICT (id) DO NOTHING;

INSERT INTO storage.buckets (id, name, public)
VALUES ('resumes', 'resumes', false)
ON CONFLICT (id) DO NOTHING;

-- signed-in users may upload card images into their own folder only
CREATE POLICY "card images upload" ON storage.objects
  FOR INSERT TO authenticated
  WITH CHECK (
    bucket_id = 'card-images'
    AND (storage.foldername(name))[1] = auth.uid()::text
  );

CREATE POLICY "card images read" ON storage.objects
  FOR SELECT USING (bucket_id = 'card-images');

-- ---------- Seed schools & companies ----------

INSERT INTO schools (name, short_name, type, domain, colors) VALUES
('MIT','MIT','university','mit.edu','{"primary":"#A31F34","secondary":"#8A8B8C","text":"#fff"}'),
('Stanford University','Stanford','university','stanford.edu','{"primary":"#8C1515","secondary":"#B1040E","text":"#fff"}'),
('Harvard University','Harvard','university','harvard.edu','{"primary":"#A51C30","secondary":"#C90016","text":"#fff"}'),
('UC Berkeley','Berkeley','university','berkeley.edu','{"primary":"#003262","secondary":"#FDB515","text":"#fff"}'),
('Carnegie Mellon University','CMU','university','cmu.edu','{"primary":"#C41230","secondary":"#4B505A","text":"#fff"}'),
('Georgia Tech','GT','university','gatech.edu','{"primary":"#003057","secondary":"#B3A369","text":"#fff"}'),
('University of Michigan','UMich','university','umich.edu','{"primary":"#00274C","secondary":"#FFCB05","text":"#fff"}'),
('UCLA','UCLA','university','ucla.edu','{"primary":"#2D68C4","secondary":"#F2A900","text":"#fff"}'),
('NYU','NYU','university','nyu.edu','{"primary":"#57068C","secondary":"#8900E1","text":"#fff"}'),
('Columbia University','Columbia','university','columbia.edu','{"primary":"#003DA5","secondary":"#B9D9EB","text":"#fff"}'),
('Cornell University','Cornell','university','cornell.edu','{"primary":"#B31B1B","secondary":"#222","text":"#fff"}'),
('Princeton University','Princeton','university','princeton.edu','{"primary":"#FF8F00","secondary":"#000","text":"#000"}'),
('Yale University','Yale','university','yale.edu','{"primary":"#00356B","secondary":"#286DC0","text":"#fff"}'),
('University of Washington','UW','university','uw.edu','{"primary":"#4B2E83","secondary":"#B7A57A","text":"#fff"}'),
('서울대학교','SNU','university','snu.ac.kr','{"primary":"#000D8A","secondary":"#0038A8","text":"#fff"}'),
('연세대학교','연세대','university','yonsei.ac.kr','{"primary":"#00205B","secondary":"#003DA5","text":"#fff"}'),
('고려대학교','고려대','university','korea.ac.kr','{"primary":"#8B0000","secondary":"#CC0000","text":"#fff"}'),
('KAIST','KAIST','university','kaist.ac.kr','{"primary":"#003087","secondary":"#E31937","text":"#fff"}'),
('성균관대학교','성균관대','university','skku.edu','{"primary":"#002366","secondary":"#B8860B","text":"#fff"}'),
('POSTECH','POSTECH','university','postech.ac.kr','{"primary":"#003087","secondary":"#0066CC","text":"#fff"}'),
('Google','Google','company','google.com','{"primary":"#4285F4","secondary":"#34A853","text":"#fff"}'),
('Apple','Apple','company','apple.com','{"primary":"#000000","secondary":"#555","text":"#fff"}'),
('Meta','Meta','company','meta.com','{"primary":"#0866FF","secondary":"#1877F2","text":"#fff"}'),
('Amazon','Amazon','company','amazon.com','{"primary":"#232F3E","secondary":"#FF9900","text":"#fff"}'),
('Microsoft','Microsoft','company','microsoft.com','{"primary":"#00A4EF","secondary":"#7FBA00","text":"#fff"}'),
('Netflix','Netflix','company','netflix.com','{"primary":"#E50914","secondary":"#B81D24","text":"#fff"}'),
('Anthropic','Anthropic','company','anthropic.com','{"primary":"#CC785C","secondary":"#191919","text":"#fff"}');
