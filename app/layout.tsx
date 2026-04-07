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
      <body className="min-h-full flex flex-col">
        {/* gradient to make it look seamless */}
        <div className="w-full bg-linear-to-b from-white to-white/0 h-10 sticky top-0 z-50"></div>
        {children}
        <div className="w-full bg-linear-to-t from-white to-white/0 h-10 sticky bottom-0 z-50"></div>
      </body>
    </html>
  );
}
