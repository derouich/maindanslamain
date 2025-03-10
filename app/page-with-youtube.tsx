import YouTubeEmbed from "@/components/youtube-embed"

// Exemples de vidéos YouTube
const youtubeVideos = [
  {
    id: "video1",
    videoId: "MQiJgoWy8sg", // ID de la vidéo YouTube
    title: "Notre philosophie",
  },
  {
    id: "video2",
    videoId: "MQiJgoWy8sg", // Remplacez par l'ID de votre vidéo
    title: "Témoignages inspirants",
  },
  {
    id: "video3",
    videoId: "MQiJgoWy8sg", // Remplacez par l'ID de votre vidéo
    title: "Méditation guidée",
  },
]

export default function Home() {
  return (
    <main className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative flex flex-col items-center justify-center min-h-screen px-4 py-20 overflow-hidden text-white">
        {/* ... (reste du code inchangé) ... */}
      </section>

      {/* YouTube Videos Section */}
      <section id="videos" className="py-20 bg-white">
        <div className="container px-4 mx-auto">
          <h2 className="mb-12 text-3xl font-bold text-center text-gray-800 sm:text-4xl">Découvrez Notre Vision</h2>

          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {youtubeVideos.map((video) => (
              <div key={video.id} className="flex flex-col">
                <YouTubeEmbed videoId={video.videoId} title={video.title} />
                <h3 className="mt-4 text-xl font-semibold text-gray-800">{video.title}</h3>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ... (reste du code inchangé) ... */}
    </main>
  )
}

