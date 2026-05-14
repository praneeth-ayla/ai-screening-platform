import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import AuthProvider from "@/components/providers/auth-provider";
import Navbar from "@/components/Navbar";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://yourdomain.com"),

  title: {
    default: "HireFlow AI",
    template: "%s | HireFlow AI",
  },

  description:
    "HireFlow AI is an AI-powered voice interview and candidate screening platform for modern recruitment teams.",

  applicationName: "HireFlow AI",

  keywords: [
    "AI interview platform",
    "AI voice interviews",
    "candidate screening",
    "recruitment platform",
    "hiring software",
    "AI recruitment",
    "voice AI",
    "Bolna AI",
    "interview automation",
  ],

  authors: [
    {
      name: "Praneeth Ayla",
    },
  ],

  creator: "Praneeth Ayla",

  openGraph: {
    title: "HireFlow AI",
    description: "AI-powered voice interview and candidate screening platform.",
    url: "https://yourdomain.com",
    siteName: "HireFlow AI",
    locale: "en_US",
    type: "website",
  },

  twitter: {
    card: "summary_large_image",
    title: "HireFlow AI",
    description: "AI-powered voice interview and candidate screening platform.",
  },

  robots: {
    index: true,
    follow: true,
  },

  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon.ico",
    apple: "/apple-icon.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <AuthProvider>
          <Navbar />
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}
