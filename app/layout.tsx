import type { Metadata } from "next";
import "./globals.css";
import { ChatWidget } from "@/components/chat-widget";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { profile, siteUrl } from "@/content/profile";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Dinupa Devinda | AI/ML Engineer | Software Engineer",
    template: "%s | Dinupa Devinda"
  },
  description:
    "Dinupa Devinda's AI/ML and software engineering portfolio: computer vision, language models, RAG, audio and sensor-based ML, and model deployment.",
  alternates: {
    canonical: "/"
  },
  openGraph: {
    type: "website",
    url: siteUrl,
    title: "Dinupa Devinda | AI/ML Engineer | Software Engineer",
    description:
      "Computer vision, language models, RAG, and applied AI systems by Dinupa Devinda.",
    siteName: "Dinupa Devinda Portfolio",
    images: [
      {
        url: profile.portrait,
        width: 1254,
        height: 1254,
        alt: "Dinupa Devinda"
      }
    ]
  },
  twitter: {
    card: "summary_large_image",
    title: "Dinupa Devinda | AI/ML Engineer | Software Engineer",
    description:
      "Computer vision, language models, RAG, and applied AI systems by Dinupa Devinda.",
    images: [profile.portrait]
  },
  icons: {
    icon: profile.portrait
  }
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: profile.name,
    jobTitle: "Trainee - Software Engineer (AI/ML)",
    worksFor: { "@type": "Organization", name: "Scicom MSC Berhad" },
    url: siteUrl,
    email: profile.email,
    sameAs: [profile.links.github, profile.links.linkedin, profile.links.kaggle]
  };

  return (
    <html lang="en">
      <body>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        <SiteHeader />
        <main className="page-shell">{children}</main>
        <SiteFooter />
        <ChatWidget />
      </body>
    </html>
  );
}
