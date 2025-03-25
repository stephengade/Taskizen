import type { Metadata } from "next"
import { Inter, Bricolage_Grotesque } from "next/font/google"
import { Toaster } from "@/components/ui/toaster"
import "./globals.css";

const inter = Bricolage_Grotesque({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Taskizen - Things to Do",
  description: "A simple and effective task management app",
  openGraph: {
    title: "Taskizen - Things to Do",
    description: "A simple and effective task management app",
    type: "website",
    locale: "en_US",
    url: "https://taskizen.vercel.app",
    siteName: "Taskizen",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Taskizen - Task Management App",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Taskizen - Things to Do",
    description: "A simple and effective task management app",
    images: ["/og-image.jpg"],
  },
  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon-16x16.png",
    apple: "/apple-touch-icon.png",
  },
  manifest: "/site.webmanifest",
}


export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        {children}
        <Toaster />
      </body>
    </html>
  )
}

