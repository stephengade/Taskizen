import type { Metadata } from "next"
import { Poppins, Manrope } from "next/font/google"
import { Toaster } from "@/components/ui/toaster"
import "./globals.css";

const inter = Manrope({ subsets: ["latin"] })

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
        url: "https://taskizen.vercel.app/task-og-image.png",
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
    images: ["https://taskizen.vercel.app/task-og-image.png"],
    creator: '@stephen_olgade',
  },
  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon-16x16.png",
    apple: "/apple-touch-icon.png",
  },
  robots: {
    index: true,
    follow: true,
    nocache: false,
    googleBot: {
      index: true,
      follow: true,
      noimageindex: false,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  manifest: "https://taskizen.vercel.app/site.webmanifest",
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

