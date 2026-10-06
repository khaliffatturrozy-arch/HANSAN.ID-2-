import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "HANSAN — F&B Operations Platform",
  description:
    "HANSAN is an F&B / restaurant POS and operational SaaS platform. UI/UX foundation sprint.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">{children}</body>
    </html>
  );
}

