import type React from "react"
import "./globals.css"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import { Toaster } from "sonner"
import PageViewTracker from "@/components/page-view-tracker"
import SiteHeader from "@/components/site-header"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "MainDansLaMain - Votre Voyage Spirituel Commence Bientôt",
  description:
    "Embarquez dans une expérience transformative de mentorat avec Dr. Youness Chraibi. Découvrez comment MainDansLaMain peut vous guider vers l'épanouissement personnel et spirituel.",
  // Remove the icons configuration completely to avoid any favicon references
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="fr">
      <body className={inter.className}>
        <SiteHeader />
        {children}
        <Toaster position="top-center" />
        <PageViewTracker />
      </body>
    </html>
  )
}

