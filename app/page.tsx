import SubscriptionForm from "@/components/subscription-form"
import SocialLinks from "@/components/social-links"
import InstagramFeed from "@/components/instagram-feed"
import VideoGallery from "@/components/video-gallery"
import { ArrowDown } from "lucide-react"
import Logo from "@/components/logo"
import { supabaseAdmin } from "@/lib/supabase"
import ParisEventSection from "@/components/paris-event-section"
import { getSectionVisibility } from "./actions/section-visibility"

// Définir le type Video pour assurer la cohérence
interface Video {
  id: string
  url: string
  title: string
  description?: string
  category: string
  thumbnailUrl?: string
  isDemo?: boolean
}

// Désactiver le cache de la page
export const revalidate = 0
export const dynamic = "force-dynamic"

export default async function Home() {
  // Récupérer les paramètres de visibilité des sections
  const sectionVisibility = await getSectionVisibility()
  const isSectionVisible = (sectionId: string) => {
    const section = sectionVisibility.find((s) => s.section_id === sectionId)
    return section ? section.is_visible : true // Par défaut visible si non trouvé
  }

  // Récupérer les vidéos directement depuis Supabase au lieu de passer par l'API
  let videos: Video[] = []

  try {
    console.log("Récupération des vidéos depuis Supabase...")

    const { data: videosData, error } = await supabaseAdmin
      .from("videos")
      .select("*")
      .neq("file_name", "temp")
      .order("created_at", { ascending: false })

    if (error) {
      console.error("Erreur lors de la récupération des vidéos:", error)
      throw error
    }

    // Transformer les données pour le composant VideoGallery
    videos = videosData.map((video) => ({
      id: video.id,
      url: video.url,
      title: video.title,
      description: video.description || undefined,
      category: video.category,
      thumbnailUrl: video.thumbnail_url || undefined,
      isDemo: false, // Ajouter cette propriété pour les vidéos de la base de données
    }))

    console.log(`${videos.length} vidéos récupérées avec succès`)
  } catch (error) {
    console.error("Erreur lors de la récupération des vidéos:", error)

    // Vidéos de secours en cas d'erreur
    videos = [
      {
        id: "error",
        url: "https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4",
        title: "Erreur de chargement",
        description: "Impossible de charger les vidéos. Veuillez réessayer plus tard.",
        category: "Erreur",
        isDemo: true,
      },
    ]
  }

  // Si aucune vidéo n'est trouvée, utiliser une vidéo de démonstration
  if (videos.length === 0) {
    videos = [
      {
        id: "demo",
        url: "https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4",
        title: "Bienvenue sur MainDansLaMain",
        description: "Ajoutez votre première vidéo dans l'interface d'administration.",
        category: "Spiritualité",
        isDemo: true,
      },
    ]
  }

  return (
    <main className="min-h-screen flex flex-col bg-white">
      {/* Paris Event Section */}
      {isSectionVisible("paris-event") && <ParisEventSection />}

      {/* Hero Section */}
      {isSectionVisible("hero") && (
        <section className="relative flex flex-col items-center justify-center min-h-screen px-4 py-20 overflow-hidden text-white">
          {/* Motif de fond */}
          <div
            className="absolute inset-0 z-0 bg-cover bg-center opacity-30"
            style={{
              backgroundImage: 'url("https://iili.io/3FVLArJ.md.jpg")',
              backgroundRepeat: "repeat",
            }}
            aria-hidden="true"
          ></div>

          {/* Overlay vert émeraude */}
          <div className="absolute inset-0 bg-emerald-600 opacity-80 z-10"></div>

          <div className="container relative z-20 flex flex-col items-center justify-center max-w-4xl mx-auto text-center">
            {/* Logo en haut de la section héros */}
            <div className="mb-8">
              <Logo size="lg" white />
            </div>

            <h1 className="mb-6 text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl">
              Votre Voyage Spirituel Commence Bientôt
            </h1>
            <p className="max-w-2xl mb-10 text-lg sm:text-xl md:text-2xl">
              Embarquez dans une expérience transformative de mentorat avec Dr. Youness Chraibi. Découvrez comment
              MainDansLaMain peut vous guider vers l'épanouissement personnel et spirituel.
            </p>
            <a
              href="#videos"
              className="flex items-center justify-center w-12 h-12 p-2 text-emerald-600 transition-transform bg-white rounded-full animate-bounce hover:scale-110"
              aria-label="Scroll to video section"
            >
              <ArrowDown className="w-6 h-6" />
            </a>
          </div>
        </section>
      )}

      {/* Video Gallery Section */}
      {isSectionVisible("videos") && (
        <section id="videos" className="py-10 bg-white">
          <div className="container px-4 mx-auto">
            <div className="mb-8 text-center">
              <h2 className="inline-block px-6 py-2 text-3xl font-bold text-white bg-emerald-600 rounded-full shadow-lg sm:text-4xl">
                ✨ Découvrez Notre Vision ✨
              </h2>
              <div className="w-24 h-1 mx-auto mt-4 bg-emerald-500 rounded-full"></div>
            </div>

            <VideoGallery videos={videos} />

            {videos[0]?.isDemo && (
              <div className="mt-8 p-4 bg-yellow-50 border border-yellow-200 rounded-lg text-center">
                <p className="text-yellow-800">
                  <strong>Note:</strong>{" "}
                  {videos[0]?.id === "error"
                    ? "Une erreur s'est produite lors du chargement des vidéos. Veuillez réessayer plus tard."
                    : "Connectez-vous à l'interface d'administration pour ajouter vos propres vidéos."}
                </p>
              </div>
            )}
          </div>
        </section>
      )}

      {/* Instagram Feed Section */}
      {isSectionVisible("instagram") && (
        <section id="instagram" className="py-10 bg-gray-50">
          <div className="container px-4 mx-auto">
            <div className="mb-8 text-center">
              <h2 className="inline-block px-6 py-2 text-3xl font-bold text-white bg-emerald-600 rounded-full shadow-lg sm:text-4xl">
                📱 Suivez Notre Parcours 📱
              </h2>
              <div className="w-24 h-1 mx-auto mt-4 bg-emerald-500 rounded-full"></div>
            </div>
            <div className="max-w-xl mx-auto">
              <InstagramFeed username="drchraibi.main.ds.la.main" className="w-full mx-auto" />
            </div>
          </div>
        </section>
      )}

      {/* Subscription Section */}
      {isSectionVisible("subscription") && (
        <section className="py-10 bg-white">
          <div className="container max-w-4xl px-4 mx-auto">
            <div className="p-8 bg-gray-50 rounded-lg shadow-lg">
              <div className="mb-6 text-center">
                <h2 className="inline-block px-6 py-2 text-3xl font-bold text-white bg-emerald-600 rounded-full shadow-lg">
                  🌟 Rejoignez-Nous 🌟
                </h2>
                <div className="w-24 h-1 mx-auto mt-4 bg-emerald-500 rounded-full"></div>
              </div>
              <p className="mb-6 text-lg text-center text-gray-600">
                Inscrivez-vous à notre liste d'attente pour être informé dès que nous lançons notre plateforme et pour
                accéder à des offres exclusives.
              </p>
              <SubscriptionForm />
            </div>
          </div>
        </section>
      )}

      {/* Social Links Section */}
      {isSectionVisible("social-links") && <SocialLinks />}

      {/* Footer */}
      <footer className="py-8 text-white bg-emerald-800 mt-auto">
        <div className="container px-4 mx-auto">
          <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
            <div className="flex items-center">
              <Logo size="sm" white className="mr-3" />
              <div>
                <h3 className="text-xl font-bold">MainDansLaMain</h3>
                <p className="text-emerald-200">Votre partenaire pour le développement spirituel</p>
              </div>
            </div>
            <div className="text-sm text-emerald-200">
              &copy; {new Date().getFullYear()} MainDansLaMain. Tous droits réservés.
            </div>
          </div>
        </div>
      </footer>
    </main>
  )
}

