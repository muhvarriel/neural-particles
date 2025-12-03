import type { Metadata } from "next";
import { Outfit } from "next/font/google";
import "./globals.css";

const outfit = Outfit({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-outfit",
  display: "swap",
});

export const metadata: Metadata = {
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

  // OpenGraph metadata for social sharing
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

  // Twitter Card metadata
  twitter: {
    card: "summary_large_image",
    title: "Neural Particles | Interactive 3D Hand Gesture Control",
    description:
      "Experience interactive 3D particle system with hand gesture control using MediaPipe and Three.js",
    images: ["/og-image.png"],
    creator: "@muhvarriel",
  },

  // Viewport configuration for mobile
  viewport: {
    width: "device-width",
    initialScale: 1,
    maximumScale: 5,
    userScalable: true,
  },

  // Theme color for browser UI
  themeColor: "#00f3ff",

  // Icons
  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon.ico",
    apple: "/apple-touch-icon.png",
  },

  // Web app manifest
  manifest: "/manifest.json",

  // Additional metadata
  applicationName: "Neural Particles",
  category: "Interactive Art",
  classification: "Interactive 3D Application",

  // Robots
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

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={outfit.variable}>
      <head>
        {/* Additional meta tags */}
        <meta name="format-detection" content="telephone=no" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta
          name="apple-mobile-web-app-status-bar-style"
          content="black-translucent"
        />
        <meta name="apple-mobile-web-app-title" content="Neural Particles" />
      </head>
      <body className="antialiased">{children}</body>
    </html>
  );
}
