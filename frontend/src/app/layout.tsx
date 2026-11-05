import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: { default: "EterPay — Your Money. Everywhere. Intelligently Connected.", template: "%s | EterPay" },
  description: "EterPay is an AI-powered global financial platform bringing payments, money management, international finance, commerce, travel and financial intelligence into one connected experience.",
  icons: {
    icon: "/brand/favicon.svg",
  },
  keywords: ["EterPay", "global payments", "AI finance", "currency exchange", "PayPal", "international payments"],
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className="scroll-smooth">
      <head>
        <link rel="stylesheet" href="https://use.typekit.net/dgb7utl.css" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400..700;1,400..700&family=Plus+Jakarta+Sans:wght@300;400;500;600;700&display=swap" rel="stylesheet" />
      </head>
      <body className="antialiased min-h-screen">
        {children}
      </body>
    </html>
  );
}
