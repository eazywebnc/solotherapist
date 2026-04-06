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
  robots: {
    index: true,
    follow: true,
  },
};

const jsonLd = {
  "@context": "https://schema.org",
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
