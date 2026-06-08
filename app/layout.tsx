import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Care Net Consultants Portal",
  description: "Care Net Consultants (Pty) Ltd — Internal Management Portal",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
