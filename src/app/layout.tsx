import type { Metadata } from "next";
import { Inter, Geist_Mono } from "next/font/google";
import { Toaster } from "sonner";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "BookSpace — Smart Resource Booking System",
  description:
    "Eliminate double-bookings and scheduling conflicts. BookSpace lets teams reserve shared resources with automatic conflict detection and 10-minute buffer time management.",
  keywords: ["booking", "resource management", "scheduling", "conflict detection", "team"],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body
        className={`${inter.variable} ${geistMono.variable} antialiased font-sans`}
      >
        {children}
        <Toaster
          theme="dark"
          toastOptions={{
            style: {
              background: "rgba(20, 20, 32, 0.95)",
              border: "1px solid rgba(217, 70, 239, 0.2)",
              color: "#f1f5f9",
              backdropFilter: "blur(12px)",
            },
          }}
        />
      </body>
    </html>
  );
}
