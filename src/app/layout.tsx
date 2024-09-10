import type { Metadata, Viewport } from "next";
import "./globals.css";
import ClientWrapper from "./ClientWrapper";

// const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: {
    template: "%s | PAi",
    default: "PAi"
  },
  description: "Personal AI Assistant",
  icons: {
    icon: "/icons/pai.favicon.png"
  },
  manifest: "/manifest.json"
};

export function generateViewport(): Viewport {
  return {
    width: "device-width",
    initialScale: 1,
    maximumScale: 1,
    userScalable: false,
    viewportFit: "cover"
  };
}

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="font-custom">
        <ClientWrapper>{children}</ClientWrapper>
      </body>
    </html>
  );
}
