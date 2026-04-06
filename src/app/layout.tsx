import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "SoloTherapist — All-in-One Platform for Solo Practitioners",
  description:
    "The complete practice management platform for therapists, psychologists and coaches. Appointments, patient notes, invoicing, video sessions — all in one place.",
  keywords: [
    "therapist software",
    "practice management",
    "therapy scheduling",
    "patient notes",
    "solo practitioner tools",
    "psychologist software",
    "coach management platform",
    "telehealth platform",
  ],
  metadataBase: new URL("https://solotherapist.eazyweb.nc"),
  alternates: {
    canonical: "https://solotherapist.eazyweb.nc",
  },
  openGraph: {
    title: "SoloTherapist — All-in-One Platform for Solo Practitioners",
    description:
      "Appointments, notes, invoicing, video sessions — all in one place.",
    url: "https://solotherapist.eazyweb.nc",
    siteName: "SoloTherapist",
    type: "website",
    locale: "en_US",
  },
  robots: { index: true, follow: true, "max-image-preview": "large", "max-snippet": -1, "max-video-preview": -1 },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebSite",
      name: "SoloTherapist",
      url: "https://solotherapist.eazyweb.nc",
      publisher: {
        "@type": "Organization",
        name: "EazyWebNC",
        url: "https://eazyweb.nc",
        logo: { "@type": "ImageObject", url: "https://eazyweb.nc/logo.png" },
      },
    },
    {
      "@type": "SoftwareApplication",
      name: "SoloTherapist",
      applicationCategory: "HealthApplication",
      operatingSystem: "Web",
      url: "https://solotherapist.eazyweb.nc",
      description:
        "Complete practice management platform for therapists, psychologists and coaches. Appointments, notes, invoicing, video sessions.",
      offers: [
        { "@type": "Offer", name: "Solo", price: "29", priceCurrency: "USD" },
        { "@type": "Offer", name: "Practice", price: "59", priceCurrency: "USD" },
        { "@type": "Offer", name: "Clinic", price: "129", priceCurrency: "USD" },
      ],
      creator: { "@type": "Organization", name: "EazyWebNC", url: "https://eazyweb.nc" },
    },
    {
      "@type": "FAQPage",
      mainEntity: [
        {
          "@type": "Question",
          name: "What is SoloTherapist?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "SoloTherapist is an all-in-one practice management platform designed for therapists, psychologists, and coaches. It handles scheduling, patient notes, invoicing, and video sessions in one place.",
          },
        },
        {
          "@type": "Question",
          name: "What features does SoloTherapist offer?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "SoloTherapist includes appointment scheduling, secure patient notes, invoicing, integrated video sessions for telehealth, and a client portal — everything a solo practitioner needs.",
          },
        },
        {
          "@type": "Question",
          name: "Is SoloTherapist suitable for solo practitioners?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Absolutely! SoloTherapist is built specifically for independent therapists, psychologists, and coaches who need a simple, affordable, all-in-one practice management solution.",
          },
        },
      ],
    },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased dark`}
    >
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className="min-h-full flex flex-col bg-[#030808] text-white">
        {children}
      </body>
    </html>
  );
}
