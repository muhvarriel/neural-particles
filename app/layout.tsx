import type { Metadata, Viewport } from "next";
import { Outfit } from "next/font/google";
import "./globals.css";

const outfit = Outfit({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-outfit",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://github.com/muhvarriel/neural-particles"),
  title: "Neural Particles | Interactive 3D Hand Gesture Control",
  description:
    "Experience an interactive 3D particle system controlled by hand gestures using MediaPipe and Three.js. Real-time hand tracking with dynamic particle formations including heart, sphere, flower, and spiral shapes.",
  keywords: [
    "neural particles",
    "hand tracking",
    "gesture control",
    "three.js",
    "mediapipe",
    "webgl",
    "interactive art",
    "3d particles",
    "hand gestures",
    "computer vision",
    "react three fiber",
    "next.js",
  ],
  authors: [{ name: "muhvarriel", url: "https://github.com/muhvarriel" }],
  creator: "muhvarriel",
  publisher: "muhvarriel",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://github.com/muhvarriel/neural-particles",
    title: "Neural Particles | Interactive 3D Hand Gesture Control",
    description:
      "Experience interactive 3D particle system with hand gesture control using MediaPipe and Three.js",
    siteName: "Neural Particles",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Neural Particles - Interactive 3D particle system with hand gesture control",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Neural Particles | Interactive 3D Hand Gesture Control",
    description:
      "Experience interactive 3D particle system with hand gesture control using MediaPipe and Three.js",
    images: ["/og-image.png"],
    creator: "@muhvarriel",
  },
  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon.ico",
    apple: "/apple-touch-icon.png",
  },
  manifest: "/manifest.json",
  applicationName: "Neural Particles",
  category: "Interactive Art",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
  themeColor: "#00f3ff",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={outfit.variable}>
      <body className="antialiased">{children}</body>
    </html>
  );
}
