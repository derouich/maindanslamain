"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Menu, X, Home, Video, BarChart2, Users, PlusCircle, Layers } from "lucide-react"
import Logo from "@/components/logo"

export default function AdminHeader() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const pathname = usePathname()

  const navItems = [
    { href: "/admin", label: "Tableau de bord", icon: <Home className="h-4 w-4 mr-2" /> },
    { href: "/admin/videos", label: "Gestion des vidéos", icon: <Video className="h-4 w-4 mr-2" /> },
    {
      href: "/admin/videos#upload",
      label: "Ajouter une vidéo",
      icon: <PlusCircle className="h-4 w-4 mr-2" />,
      highlight: true,
    },
    { href: "/admin/stats", label: "Statistiques", icon: <BarChart2 className="h-4 w-4 mr-2" /> },
    { href: "/admin/subscribers", label: "Abonnés", icon: <Users className="h-4 w-4 mr-2" /> },
    { href: "/admin/sections", label: "Sections", icon: <Layers className="h-4 w-4 mr-2" /> },
  ]

  return (
    <header className="bg-emerald-800 text-white shadow-md">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <Link href="/admin" className="flex items-center">
              <Logo size="sm" white className="mr-2" />
              <span className="font-bold text-xl">Admin</span>
            </Link>
          </div>

          {/* Navigation desktop */}
          <nav className="hidden md:flex space-x-4">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center px-3 py-2 rounded-md text-sm font-medium ${
                  pathname === item.href.split("#")[0]
                    ? "bg-emerald-700 text-white"
                    : item.highlight
                      ? "bg-emerald-600 text-white hover:bg-emerald-500"
                      : "text-emerald-100 hover:bg-emerald-700 hover:text-white"
                }`}
              >
                {item.icon}
                {item.label}
              </Link>
            ))}
            <Link
              href="/"
              className="flex items-center px-3 py-2 rounded-md text-sm font-medium text-emerald-100 hover:bg-emerald-700 hover:text-white"
            >
              <Home className="h-4 w-4 mr-2" />
              Site
            </Link>
          </nav>

          {/* Bouton menu mobile */}
          <div className="md:hidden">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-white hover:bg-emerald-700"
            >
              {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </Button>
          </div>
        </div>
      </div>

      {/* Menu mobile */}
      {isMenuOpen && (
        <div className="md:hidden">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center px-3 py-2 rounded-md text-sm font-medium ${
                  pathname === item.href.split("#")[0]
                    ? "bg-emerald-700 text-white"
                    : item.highlight
                      ? "bg-emerald-600 text-white"
                      : "text-emerald-100 hover:bg-emerald-700 hover:text-white"
                }`}
                onClick={() => setIsMenuOpen(false)}
              >
                {item.icon}
                {item.label}
              </Link>
            ))}
            <Link
              href="/"
              className="flex items-center px-3 py-2 rounded-md text-sm font-medium text-emerald-100 hover:bg-emerald-700 hover:text-white"
              onClick={() => setIsMenuOpen(false)}
            >
              <Home className="h-4 w-4 mr-2" />
              Site
            </Link>
          </div>
        </div>
      )}
    </header>
  )
}

