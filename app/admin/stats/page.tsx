import { createClient } from "@supabase/supabase-js"
import AdminHeader from "@/components/admin/admin-header"
import StatsOverview from "@/components/admin/stats-overview"
import VisitorsChart from "@/components/admin/visitors-chart"
import TopVideosChart from "@/components/admin/top-videos-chart"

// Créer directement un client Supabase avec la clé de service
const supabaseAdmin = createClient(
  "https://znpcnzkaaokxpxqexksu.supabase.co",
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InpucGNuemthYW9reHB4cWV4a3N1Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc0MTIxNjc0MCwiZXhwIjoyMDU2NzkyNzQwfQ.PaOShOpz6Tg7s7RMrhe22Iqci3qZGVDZ5M0ajJIFNp0",
)

export default async function AdminStatsPage() {
  // Récupérer les statistiques générales
  let totalPageViews = 0
  let totalVideoViews = 0
  let totalVideoPlays = 0
  let totalSubscribers = 0
  let visitorData: any[] = []
  let topVideos: any[] = []

  try {
    // Vérifier si les tables existent avant de faire les requêtes
    const { error: pageViewsTableCheck } = await supabaseAdmin
      .from("page_views")
      .select("id", { count: "exact", head: true })
    if (!pageViewsTableCheck) {
      const { count: pageViewsCount } = await supabaseAdmin
        .from("page_views")
        .select("*", { count: "exact", head: true })
      totalPageViews = pageViewsCount || 0
    } else {
      console.log("Table page_views n'existe pas encore")
    }

    const { error: videoViewsTableCheck } = await supabaseAdmin
      .from("video_views")
      .select("id", { count: "exact", head: true })
    if (!videoViewsTableCheck) {
      const { count: videoViewsCount } = await supabaseAdmin
        .from("video_views")
        .select("*", { count: "exact", head: true })
      totalVideoViews = videoViewsCount || 0
    } else {
      console.log("Table video_views n'existe pas encore")
    }

    const { error: videoPlaysTableCheck } = await supabaseAdmin
      .from("video_plays")
      .select("id", { count: "exact", head: true })
    if (!videoPlaysTableCheck) {
      const { count: videoPlaysCount } = await supabaseAdmin
        .from("video_plays")
        .select("*", { count: "exact", head: true })
      totalVideoPlays = videoPlaysCount || 0
    } else {
      console.log("Table video_plays n'existe pas encore")
    }

    const { error: subscribersTableCheck } = await supabaseAdmin
      .from("subscribers")
      .select("id", { count: "exact", head: true })
    if (!subscribersTableCheck) {
      const { count: subscribersCount } = await supabaseAdmin
        .from("subscribers")
        .select("*", { count: "exact", head: true })
      totalSubscribers = subscribersCount || 0
    } else {
      console.log("Table subscribers n'existe pas encore")
    }

    // Récupérer les données pour le graphique des visiteurs (30 derniers jours)
    const thirtyDaysAgo = new Date()
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)

    if (!pageViewsTableCheck) {
      const { data: pageViewsData } = await supabaseAdmin
        .from("page_views")
        .select("created_at")
        .gte("created_at", thirtyDaysAgo.toISOString())
        .order("created_at", { ascending: true })

      visitorData = pageViewsData || []
    }

    // Récupérer les vidéos les plus vues
    if (!videoViewsTableCheck && !videoPlaysTableCheck) {
      const { data: videosData, error: videosError } = await supabaseAdmin
        .from("videos")
        .select(`
        id,
        title
      `)
        .order("created_at", { ascending: false })
        .limit(10)

      if (!videosError && videosData) {
        // Pour chaque vidéo, récupérer le nombre de vues et de lectures
        topVideos = await Promise.all(
          videosData.map(async (video) => {
            const { count: viewsCount } = await supabaseAdmin
              .from("video_views")
              .select("*", { count: "exact", head: true })
              .eq("video_id", video.id)

            const { count: playsCount } = await supabaseAdmin
              .from("video_plays")
              .select("*", { count: "exact", head: true })
              .eq("video_id", video.id)

            return {
              title: video.title,
              views: viewsCount || 0,
              plays: playsCount || 0,
            }
          }),
        )
      }
    }
  } catch (error) {
    console.error("Erreur lors de la récupération des statistiques:", error)
  }

  // Formater les données pour les graphiques
  const formattedVisitorData = processVisitorData(visitorData)
  const formattedTopVideos = topVideos.length > 0 ? topVideos : []

  return (
    <div className="min-h-screen bg-gray-100">
      <AdminHeader />

      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">Statistiques</h1>

        <StatsOverview
          pageViews={totalPageViews}
          videoViews={totalVideoViews}
          videoPlays={totalVideoPlays}
          subscribers={totalSubscribers}
        />

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-8">
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold mb-4">Visiteurs (30 derniers jours)</h2>
            {formattedVisitorData.length > 0 ? (
              <VisitorsChart data={formattedVisitorData} />
            ) : (
              <p className="text-gray-500 text-center py-10">Aucune donnée de visite disponible pour le moment.</p>
            )}
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold mb-4">Vidéos les plus populaires</h2>
            {formattedTopVideos.length > 0 ? (
              <TopVideosChart data={formattedTopVideos} />
            ) : (
              <p className="text-gray-500 text-center py-10">Aucune donnée de vidéo disponible pour le moment.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

// Fonction pour traiter les données des visiteurs
function processVisitorData(data: any[]) {
  const dateMap = new Map()

  // Initialiser les 30 derniers jours avec des valeurs à 0
  for (let i = 0; i < 30; i++) {
    const date = new Date()
    date.setDate(date.getDate() - i)
    const dateStr = date.toISOString().split("T")[0]
    dateMap.set(dateStr, 0)
  }

  // Compter les vues par jour
  data.forEach((item) => {
    const dateStr = new Date(item.created_at).toISOString().split("T")[0]
    if (dateMap.has(dateStr)) {
      dateMap.set(dateStr, dateMap.get(dateStr) + 1)
    }
  })

  // Convertir en tableau pour le graphique
  return Array.from(dateMap.entries())
    .sort(([dateA], [dateB]) => dateA.localeCompare(dateB))
    .map(([date, count]) => ({
      date,
      count,
    }))
}

