import type { Metadata } from "next";
import "./globals.css";
import LockScreen from './components/LockScreen';
export const metadata: Metadata = {
  title: "LifePulse OS",
  description: "Offline-First Productivity & Health Suite",
  manifest: "/manifest.json",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ka">
      <head>
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#09090b" />
      </head>
      <body>
        <LockScreen>
          {children}
        </LockScreen>
      </body>
    </html>
  );
}