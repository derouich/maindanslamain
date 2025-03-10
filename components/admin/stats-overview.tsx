"use client"

import { Eye, Play, Users, BarChart2 } from "lucide-react"

interface StatsOverviewProps {
  pageViews: number
  videoViews: number
  videoPlays: number
  subscribers: number
}

export default function StatsOverview({ pageViews, videoViews, videoPlays, subscribers }: StatsOverviewProps) {
  const stats = [
    {
      title: "Vues de pages",
      value: pageViews,
      icon: <Eye className="h-8 w-8 text-blue-500" />,
      color: "bg-blue-100",
    },
    {
      title: "Vues de vidéos",
      value: videoViews,
      icon: <BarChart2 className="h-8 w-8 text-emerald-500" />,
      color: "bg-emerald-100",
    },
    {
      title: "Lectures de vidéos",
      value: videoPlays,
      icon: <Play className="h-8 w-8 text-red-500" />,
      color: "bg-red-100",
    },
    {
      title: "Abonnés",
      value: subscribers,
      icon: <Users className="h-8 w-8 text-purple-500" />,
      color: "bg-purple-100",
    },
  ]

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {stats.map((stat, index) => (
        <div key={index} className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center">
            <div className={`p-3 rounded-full ${stat.color} mr-4`}>{stat.icon}</div>
            <div>
              <p className="text-sm font-medium text-gray-500">{stat.title}</p>
              <p className="text-2xl font-bold">{stat.value.toLocaleString()}</p>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}

