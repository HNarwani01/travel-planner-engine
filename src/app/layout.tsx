import type { Metadata } from "next";
import "./globals.css";
import { Toast } from "@/components/ui";

export const metadata: Metadata = {
  title: "Travel Planning & Experience Engine",
  description: "AI-powered personalized travel itineraries for your next adventure. Plan your trip with daily activities, budgets, and an interactive map.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <Toast>{children}</Toast>
      </body>
    </html>
  );
}
