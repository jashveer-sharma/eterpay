import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "EterPay — Your Money. Everywhere. Intelligently Connected.",
  description: "AI-Powered Global Financial Platform built for PayPal AI Hackathon 2026.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="bg-paper text-ink antialiased min-h-screen">
        {children}
      </body>
    </html>
  );
}
