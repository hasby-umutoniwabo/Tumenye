import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Providers from "@/components/Providers";
import Navigation from "@/components/Navigation";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "Tumenye - Digital Literacy for Rwandan Youth",
  description: "Learn essential digital skills including Microsoft Word, Excel, Email Communication, and Online Safety through interactive lessons and quizzes.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.variable} font-sans antialiased bg-gray-50`}>
        <Providers>
          <Navigation />
          <main>
            {children}
          </main>
        </Providers>
      </body>
    </html>
  );
}
