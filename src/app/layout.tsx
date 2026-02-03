import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "MGFD Design Portfolio",
  description: "Creating digital experiences that combine beautiful design with powerful functionality.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}