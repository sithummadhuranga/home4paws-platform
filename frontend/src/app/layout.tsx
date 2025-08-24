// src/app/layout.tsx
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

// Your Providers
import { AuthProvider } from "@/contexts/AuthContext";
import { CartProvider } from "@/contexts/CartContext"; // Make sure this is imported
import { ThemeProvider } from "@/components/ThemeProvider";

// Your UI Components
import { Toaster } from "@/components/ui/sonner"; // Updated import for notifications

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  display: "swap",
  preload: true,
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: "swap",
  preload: false,
});

export const metadata: Metadata = {
  title: "PawsHome – Find Your Perfect Pet",
  description:
    "Fast, secure pet adoption platform. Connect with loving pets from verified shelters.",
  keywords: "pet adoption, dogs, cats, animal shelter, fast adoption",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html 
      lang="en" 
      suppressHydrationWarning 
      data-scroll-behavior="smooth"
    >
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-background text-foreground transition-colors duration-200`}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <AuthProvider>
            <CartProvider> {/* This MUST wrap your children */}
              {/* You would typically place your Header and Footer components here */}
              <main>
                {children}
              </main>
              <Toaster /> {/* This component displays the notifications */}
            </CartProvider>
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}