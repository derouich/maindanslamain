"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import Logo from "@/components/logo"
import { Heart } from "lucide-react"

export default function SiteHeader() {
  const pathname = usePathname()
  const isAdminPage = pathname.startsWith("/admin")

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-emerald-700 shadow-md">
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center gap-2">
          <Link href="/" className="flex items-center gap-2 transition-transform hover:scale-105">
            <Logo size="sm" white={true} />
            <span className="hidden font-bold text-white sm:inline-block">MainDansLaMain</span>
          </Link>
        </div>

        <div className="flex items-center">
          <Heart className="h-5 w-5 text-white fill-white opacity-80" />
        </div>
      </div>
    </header>
  )
}

