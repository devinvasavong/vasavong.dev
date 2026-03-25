import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Devin Vasavong",
  description: "I love all things tech, programming, and startup culture. I'm a current Senior at Rochester Institute of Technology.",
  keywords: [
    "developer",
    "devin",
    "vasavong",
    "devin vasavong",
    "rochester institute of technology'"
  ],
  creator: "Devin Vasavong",
  publisher: "Devin Vasavong",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true
    }
  },
  category: "technology"
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${inter.className} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
