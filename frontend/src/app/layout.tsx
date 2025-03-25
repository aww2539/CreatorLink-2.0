import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "CreatorLink",
  description: "CreatorLink is a platform for creators to showcase their work and connect with others.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        {children}
      </body>
    </html>
  );
}
