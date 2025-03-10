import { supabaseAdmin } from "@/lib/supabase"
import VideoUploadForm from "@/components/admin/video-upload-form"
import VideoList from "@/components/admin/video-list"
import AdminHeader from "@/components/admin/admin-header"
import { cleanupTemporaryVideos } from "@/app/actions"
import { Button } from "@/components/ui/button"

// Disable caching for this page
export const revalidate = 0

export default async function AdminVideosPage() {
  // Fetch videos from Supabase with cache disabled
  const { data: videos, error } = await supabaseAdmin
    .from("videos")
    .select("*")
    .order("created_at", { ascending: false })
  // Remove the withCache(false) line

  if (error) {
    console.error("Erreur lors de la récupération des vidéos:", error)
  } else {
    console.log("Vidéos récupérées:", videos?.length || 0)
  }

  // Count temporary videos
  const tempVideos = videos?.filter((v) => v.file_name === "temp") || []
  const hasTemporaryVideos = tempVideos.length > 0

  return (
    <div className="min-h-screen bg-gray-100">
      <AdminHeader />

      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">Gestion des Vidéos</h1>
          {hasTemporaryVideos && (
            <form action={cleanupTemporaryVideos}>
              <Button type="submit" variant="outline" className="text-red-600 border-red-600 hover:bg-red-50">
                Nettoyer les vidéos temporaires ({tempVideos.length})
              </Button>
            </form>
          )}
        </div>

        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <h2 className="text-xl font-semibold mb-4">Informations sur les vidéos</h2>
          <div className="space-y-2 text-sm text-gray-600">
            <p>
              Nombre total de vidéos: <span className="font-semibold">{videos?.length || 0}</span>
            </p>
            <p>
              Vidéos temporaires: <span className="font-semibold">{tempVideos.length}</span>
            </p>
            <p>
              Vidéos régulières: <span className="font-semibold">{(videos?.length || 0) - tempVideos.length}</span>
            </p>
            <div className="p-4 bg-yellow-50 rounded-md border border-yellow-200 mt-4">
              <p className="font-medium text-yellow-800">Note importante:</p>
              <ul className="list-disc pl-5 mt-2 space-y-1">
                <li>Les vidéos avec "file_name" = "temp" sont des vidéos temporaires créées automatiquement.</li>
                <li>Pour qu'une vidéo apparaisse sur la page d'accueil, elle doit avoir une URL valide.</li>
                <li>Utilisez le formulaire ci-dessous pour ajouter de nouvelles vidéos.</li>
              </ul>
            </div>
          </div>
        </div>

        <div id="upload" className="bg-white rounded-lg shadow-md p-6 mb-8 scroll-mt-20">
          <h2 className="text-xl font-semibold mb-4">Ajouter une nouvelle vidéo</h2>
          <VideoUploadForm />
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold mb-4">Vidéos existantes</h2>
          <VideoList videos={videos || []} />
        </div>
      </div>
    </div>
  )
}

