import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Semester Grade Calculator",
  description: "Weighted semester grade calculator with live GPA updates and visual progress tracking.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
