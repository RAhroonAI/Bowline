import "./globals.css";
import type { Metadata, Viewport } from "next";
import { Inter, Playfair_Display } from "next/font/google";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "Sagavik",
    template: "%s · Sagavik",
  },
  description: "A small workshop of personal projects by Richard Ahroon.",
  applicationName: "Sagavik",
  authors: [{ name: "Richard Ahroon" }],
  manifest: "/manifest.json",
  icons: {
    apple: "/apple-touch-icon.png",
  },
  appleWebApp: {
    capable: true,
    title: "Sagavik",
    statusBarStyle: "default",
  },
  other: {
    "apple-mobile-web-app-capable": "yes",
    copyright: "© 2026 Richard Ahroon",
  },
};

export const viewport: Viewport = {
  themeColor: "#FAF7F2",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${inter.variable} ${playfair.variable}`}>
      <body className="min-h-screen font-sans antialiased">
        {children}
        <footer className="px-6 py-10 text-center text-sm leading-relaxed text-ink/55">
          <p className="mx-auto max-w-md">
            Built by Richard Ahroon · almost a weekend sailor, girl dad,
            doctor ·{" "}
            <a
              href="mailto:richard@floviken.se"
              className="border-b border-ink/20 pb-px transition hover:border-ink/40 hover:text-ink/80"
            >
              richard@floviken.se
            </a>
          </p>
        </footer>
      </body>
    </html>
  );
}
