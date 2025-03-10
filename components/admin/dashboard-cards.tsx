"use client"

import type React from "react"

import Link from "next/link"
import { Video, BarChart2, Users, PlusCircle } from "lucide-react"

interface DashboardCardProps {
  title: string
  description: string
  icon: React.ReactNode
  href: string
  color: string
}

function DashboardCard({ title, description, icon, href, color }: DashboardCardProps) {
  return (
    <Link href={href} className="block">
      <div className={`p-6 rounded-lg shadow-md transition-transform hover:scale-105 ${color}`}>
        <div className="flex items-center mb-4">
          <div className="p-3 rounded-full bg-white mr-4">{icon}</div>
          <h3 className="text-xl font-semibold text-white">{title}</h3>
        </div>
        <p className="text-white/90">{description}</p>
      </div>
    </Link>
  )
}

export default function DashboardCards() {
  const cards = [
    {
      title: "Gestion des vidéos",
      description: "Consultez, modifiez et supprimez les vidéos existantes",
      icon: <Video className="h-6 w-6 text-emerald-600" />,
      href: "/admin/videos",
      color: "bg-emerald-600",
    },
    {
      title: "Ajouter une vidéo",
      description: "Téléchargez une nouvelle vidéo sur le site",
      icon: <PlusCircle className="h-6 w-6 text-emerald-700" />,
      href: "/admin/videos#upload",
      color: "bg-emerald-700",
    },
    {
      title: "Statistiques",
      description: "Consultez les statistiques de visites et de lectures",
      icon: <BarChart2 className="h-6 w-6 text-blue-600" />,
      href: "/admin/stats",
      color: "bg-blue-600",
    },
    {
      title: "Abonnés",
      description: "Gérez la liste des abonnés et exportez les données",
      icon: <Users className="h-6 w-6 text-purple-600" />,
      href: "/admin/subscribers",
      color: "bg-purple-600",
    },
  ]

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {cards.map((card, index) => (
        <DashboardCard key={index} {...card} />
      ))}
    </div>
  )
}

