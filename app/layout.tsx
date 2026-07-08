import type { Metadata } from "next";
import "./globals.css";
import { ChatWidget } from "@/components/chat-widget";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { profile, siteUrl } from "@/content/profile";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Dinupa Devinda | Machine Learning Focused Engineering Graduand",
    template: "%s | Dinupa Devinda"
  },
  description:
    "Portfolio of Dinupa Devinda, a machine learning focused engineering graduand with projects across machine learning, embedded systems, R&D, and software.",
  alternates: {
    canonical: "/"
  },
  openGraph: {
    type: "website",
    url: siteUrl,
    title: "Dinupa Devinda | Machine Learning Focused Engineering Graduand",
    description:
      "Machine learning, embedded systems, R&D, automation, and software projects by Dinupa Devinda.",
    siteName: "Dinupa Devinda Portfolio",
    images: [
      {
        url: "/data/avatar/profile_pic.jpg",
        width: 800,
        height: 800,
        alt: "Dinupa Devinda"
      }
    ]
  },
  twitter: {
    card: "summary_large_image",
    title: "Dinupa Devinda | Machine Learning Focused Engineering Graduand",
    description:
      "Machine learning, embedded systems, R&D, automation, and software projects.",
    images: ["/data/avatar/profile_pic.jpg"]
  },
  icons: {
    icon: "/data/avatar/profile_pic.jpg"
  }
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: profile.name,
    jobTitle: profile.role,
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
