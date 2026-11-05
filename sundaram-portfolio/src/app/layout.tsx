import type { Metadata } from "next";
import { Inter, JetBrains_Mono, Space_Grotesk } from "next/font/google";
import { MotionConfig } from "motion/react";
import { Footer } from "@/components/contact/Footer";
import { Cursor } from "@/components/cursor/Cursor";
import { Navigation } from "@/components/navigation/Navigation";
import { TerminalProvider } from "@/components/terminal/TerminalProvider";
import { SiteEffects } from "@/components/ui/SiteEffects";
import { profile, site } from "@/data/profile";
import { themeInitScript } from "@/lib/theme";
import "./globals.css";

const spaceGrotesk = Space_Grotesk({ variable: "--font-space-grotesk", subsets: ["latin"] });
const inter = Inter({ variable: "--font-inter", subsets: ["latin"] });
const jetBrainsMono = JetBrains_Mono({ variable: "--font-jetbrains-mono", subsets: ["latin"] });

/** NEXT_PUBLIC_SITE_URL can override the domain, e.g. for a staging deployment. */
const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? site.url;

const title = `${profile.name} | ${profile.role}`;

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  alternates: { canonical: "/" },
  title,
  description: profile.description,
  openGraph: { title, description: profile.description, type: "website", siteName: site.name },
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
