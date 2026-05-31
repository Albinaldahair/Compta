import "./globals.css";
import type { Metadata, Viewport } from "next";

export const metadata: Metadata = {
  title: "ComptaQuest — L2",
  description: "Réussir l'examen de comptabilité L2 en s'amusant.",
  manifest: "/manifest.json",
  appleWebApp: { capable: true, statusBarStyle: "black-translucent", title: "ComptaQuest" },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  themeColor: "#0b0d12",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=VT323&family=Inter:wght@400;500;700;800&display=swap" rel="stylesheet" />
      </head>
      <body className="min-h-screen antialiased">
        <div className="mx-auto max-w-md sm:max-w-2xl px-4 pt-4 pb-24">{children}</div>
      </body>
    </html>
  );
}
