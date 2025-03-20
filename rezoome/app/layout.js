import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Footer from "../components/Footer"

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "ReZoomé",
  description: "AI-powered mock interview and resume review platform with real-time practice and feedback tailored to your target job",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
      <div className="flex flex-col min-h-screen">
          <main className="flex-grow">{children}</main>
          <Footer />
      </div>
      </body>
    </html>
  );
}
