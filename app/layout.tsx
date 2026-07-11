import type { Metadata, Viewport } from "next";
import "./globals.css";
import { ToastProvider } from "@/components/ui/toast";
import CustomCursor from "@/components/fx/CustomCursor";

const APP_URL = process.env.NEXT_PUBLIC_APP_URL ?? "https://voiceresume-zeta.vercel.app";

export const metadata: Metadata = {
  metadataBase: new URL(APP_URL),
  title: "VoiceResume — Just talk. Watch it write itself.",
  description:
    "Answer AI voice interview questions and get a polished resume plus a QR business card in minutes.",
  openGraph: {
    type: "website",
    url: APP_URL,
    siteName: "VoiceResume",
    title: "VoiceResume — Just talk. Watch it write itself.",
    description:
      "Answer AI voice interview questions and get a polished resume plus a QR business card in minutes.",
    images: ["/icons/icon-512.png"],
  },
  twitter: {
    card: "summary",
    title: "VoiceResume — Just talk. Watch it write itself.",
    description:
      "Answer AI voice interview questions and get a polished resume plus a QR business card in minutes.",
    images: ["/icons/icon-512.png"],
  },
  manifest: "/manifest.webmanifest",
  appleWebApp: {
    capable: true,
    title: "VoiceResume",
    statusBarStyle: "default",
  },
  icons: {
    icon: "/icons/icon-192.png",
    apple: "/icons/apple-touch-icon.png",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  themeColor: [
    { media: "(prefers-color-scheme: dark)", color: "#1c1610" },
    { media: "(prefers-color-scheme: light)", color: "#fffbeb" },
  ],
};

const themeInit = `try{var t=localStorage.getItem("theme");if(t==="dark"||(!t&&window.matchMedia("(prefers-color-scheme: dark)").matches)){document.documentElement.classList.add("dark")}}catch(e){}`;

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeInit }} />
        <link
          rel="preload"
          href="/fonts/caveat-brush.woff2"
          as="font"
          type="font/woff2"
          crossOrigin="anonymous"
        />
      </head>
      <body className="font-sans antialiased">
        <ToastProvider>{children}</ToastProvider>
        <CustomCursor />
      </body>
    </html>
  );
}
