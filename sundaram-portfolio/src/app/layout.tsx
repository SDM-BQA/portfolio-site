import type { Metadata } from "next";
import { Inter, JetBrains_Mono, Space_Grotesk } from "next/font/google";
import { MotionConfig } from "motion/react";
import { Footer } from "@/components/contact/Footer";
import { Cursor } from "@/components/cursor/Cursor";
import { Navigation } from "@/components/navigation/Navigation";
import { TerminalProvider } from "@/components/terminal/TerminalProvider";
import { SiteEffects } from "@/components/ui/SiteEffects";
import { profile } from "@/data/profile";
import { themeInitScript } from "@/lib/theme";
import "./globals.css";

const spaceGrotesk = Space_Grotesk({ variable: "--font-space-grotesk", subsets: ["latin"] });
const inter = Inter({ variable: "--font-inter", subsets: ["latin"] });
const jetBrainsMono = JetBrains_Mono({ variable: "--font-jetbrains-mono", subsets: ["latin"] });

/** Set NEXT_PUBLIC_SITE_URL once the production domain is confirmed; canonical URLs depend on it. */
const siteUrl =process.env.NEXT_PUBLIC_SITE_URL;

const title = `${profile.name} | ${profile.role}`;

export const metadata: Metadata = {
  metadataBase: new URL(
    siteUrl ?? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL ?? "localhost:3000"}`,
  ),
  ...(siteUrl ? { alternates: { canonical: "/" } } : {}),
  title,
  description: profile.description,
  openGraph: { title, description: profile.description, type: "website", siteName: "Sundaram.dev" },
  twitter: { card: "summary_large_image", title, description: profile.description },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="en"
      data-theme="dark"
      data-scroll-behavior="smooth"
      suppressHydrationWarning
      className={`${spaceGrotesk.variable} ${inter.variable} ${jetBrainsMono.variable} antialiased`}
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeInitScript }} />
        <noscript>
          <style>{`[data-reveal]{opacity:1!important;transform:none!important}`}</style>
        </noscript>
      </head>
      <body className="flex min-h-svh flex-col">
        <a
          href="#main"
          className="btn btn-primary fixed top-3 left-3 z-[60] -translate-y-24 focus-visible:translate-y-0"
        >
          Skip to content
        </a>
        <MotionConfig reducedMotion="user">
          <TerminalProvider>
            <Navigation />
            <main id="main" className="flex-1">
              {children}
            </main>
            <Footer />
          </TerminalProvider>
        </MotionConfig>
        <SiteEffects />
        <Cursor />
      </body>
    </html>
  );
}
