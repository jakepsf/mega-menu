import type { Metadata } from "next";
import "./globals.css";
import { Bagel_Fat_One, Inter, Open_Sans, Noto_Sans } from "next/font/google";
import { FirebaseClientProvider } from "@/firebase";
import { Toaster } from "@/components/ui/toaster";

export const metadata: Metadata = {
  metadataBase: new URL("https://btoreno.com"),
  title: {
    default: "Mega Menu | Interior Design & Renovation Services",
    template: "%s | Interior Design & Renovation Services"
  },
  description:
  "Professional BTO, HDB, and condo renovation services in Singapore. Explore our interior design project showcases and get a transparent cost estimate.",
keywords: [
  "BTO renovation Singapore",
  "HDB renovation",
  "interior design Singapore",
  "home renovation cost",
  "condo renovation",
  "btoreno",
  "PERSQFT",
  "renovation studio Singapore",
  'ayestudio',
  'irusu'
],
openGraph: {
  type: "website",
  locale: "en_SG",
  url: "https://btoreno.com",
  siteName: "Mega Menu",
  title: "Mega Menu | Interior Design & Renovation Singapore",
  description:
    "Discover modern interior design inspiration, interactive renovation calculators, and expert services.",
  images: [
    {
      url: "/logo.png", // Make sure this file exists in your /public folder!
      width: 1200,
      height: 630,
      alt: "Mega Menu | Interior Design Singapore",
    },
  ],
},
twitter: {
  card: "summary_large_image",
  title: "Mega Menu | Interior Design & Renovation",
  description:
    "Explore interactive renovation tools and stunning interior design showcases in Singapore.",
  images: ["/logo.png"],
},
robots: {
  index: true,
  follow: true,
  googleBot: {
    index: true,
    follow: true,
    "max-image-preview": "large",
    "max-snippet": -1,
  },
},
alternates: {
  canonical: "https://btoreno.com",
},
};

const noto = Noto_Sans({
  subsets: ["latin"],
  variable: "--font-noto",
});

const openSans = Open_Sans({
  subsets: ["latin"],
  variable: "--font-opensans",
});

const bagelFat = Bagel_Fat_One({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-bagel",
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${bagelFat.variable} ${inter.variable} ${openSans.variable} ${noto.variable}`}
    >
      <body className="font-sans antialiased bg-background text-foreground">
        <FirebaseClientProvider>{children}</FirebaseClientProvider>
        <Toaster />
      </body>
    </html>
  );
}
