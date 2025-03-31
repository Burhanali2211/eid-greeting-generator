import type { Metadata, Viewport } from "next";
import "./globals.css";
import { Toaster } from "react-hot-toast";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { AnimatedBackground } from "@/components/animated-background";
import { SessionProvider } from "@/components/session-provider";

export const metadata: Metadata = {
  title: "Eid Greeting Generator | Share Joy This Eid",
  description: "Create beautiful Eid greetings with interactive Eidi cards. Share joy and blessings with your loved ones this Eid season.",
  keywords: "Eid, greeting, Eidi, card, celebration, gift, Islamic holiday, Eid Mubarak, UPI payment",
  authors: [{ name: "Eid Greeting Generator Team" }],
  metadataBase: new URL("https://eid-greeting-generator.vercel.app"),
  openGraph: {
    title: "Eid Greeting Generator | Share Joy This Eid",
    description: "Create and share beautiful Eid greetings with Eidi cards and easy payments",
    images: ["/images/og-image.png"],
    type: "website",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "Eid Greeting Generator | Share Joy This Eid",
    description: "Create and share beautiful Eid greetings with Eidi cards and easy payments",
    images: ["/images/og-image.png"],
  },
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "any" },
      { url: "/favicon-16x16.png", sizes: "16x16", type: "image/png" },
      { url: "/favicon-32x32.png", sizes: "32x32", type: "image/png" },
    ],
    apple: [
      { url: "/apple-touch-icon.png", sizes: "180x180" }
    ],
  },
  manifest: "/site.webmanifest",
};

// Add viewport export for better mobile responsiveness
export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
  themeColor: "#16a34a",
  colorScheme: "light",
  viewportFit: "cover",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="scroll-smooth">
      <body
        className="font-sans antialiased min-h-screen flex flex-col relative overflow-x-hidden bg-eid-cream-50"
        style={{
          backgroundImage: `linear-gradient(to bottom, rgba(255, 255, 255, 0.95), rgba(255, 255, 255, 0.95)), url('/images/eid-pattern.svg')`,
          backgroundRepeat: "repeat",
          backgroundSize: "240px",
        }}
      >
        <SessionProvider>
          {/* Animated floating elements - optimized for performance */}
          <AnimatedBackground />
          
          {/* Toast notifications with improved styling */}
          <Toaster 
            position="top-center" 
            toastOptions={{
              duration: 3000,
              style: {
                background: "#fff",
                color: "#333",
                border: "1px solid #eaeaea",
                boxShadow: "0 4px 12px rgba(0,0,0,0.05)",
                padding: "16px",
                borderRadius: "8px",
                fontSize: "14px",
                maxWidth: "min(90vw, 380px)",
                fontFamily: "var(--font-sans)",
                whiteSpace: "normal"
              },
              success: {
                style: {
                  border: "1px solid #dcfce8",
                  background: "#f0fdf5",
                },
                iconTheme: {
                  primary: "#16a34a",
                  secondary: "#fff",
                },
              },
              error: {
                style: {
                  border: "1px solid #fee2e2",
                  background: "#fef2f2",
                },
                iconTheme: {
                  primary: "#ef4444",
                  secondary: "#fff",
                },
              },
            }}
          />
          
          <Header />
          
          <main className="flex-1 max-w-6xl mx-auto w-full px-4 py-4 sm:px-6 sm:py-6 md:px-8 md:py-8 z-10 relative">
            {children}
          </main>
          
          <Footer />
        </SessionProvider>
      </body>
    </html>
  );
}
