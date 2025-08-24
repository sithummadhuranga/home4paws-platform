import type { Metadata } from "next";
import { Sora, Inter } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/contexts/AuthContext";

// Modern fonts - Sora for headings, Inter for body
const sora = Sora({
  variable: "--font-sora",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  display: "swap",
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Home4Paws – Find Your Perfect Pet Companion",
  description:
    "Connect with loving pets from verified shelters. Fast, secure, and simple pet adoption platform.",
  keywords: "pet adoption, dogs, cats, animal shelter, pet care, pet supplies",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        {/* Improved theme script for smooth transitions */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  const getTheme = () => {
                    const storedTheme = localStorage.getItem('theme');
                    return storedTheme || (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
                  };
                  
                  const theme = getTheme();
                  
                  // Apply theme immediately to prevent flash
                  document.documentElement.classList.toggle('dark', theme === 'dark');
                  
                  // Monitor system preference changes
                  window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', e => {
                    if (!localStorage.getItem('theme')) {
                      document.documentElement.classList.toggle('dark', e.matches);
                    }
                  });
                } catch (e) {
                  console.error('Theme initialization failed:', e);
                }
              })();
            `,
          }}
        />
      </head>
      <body
        className={`${sora.variable} ${inter.variable} antialiased bg-background text-foreground`}
        suppressHydrationWarning
      >
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}
