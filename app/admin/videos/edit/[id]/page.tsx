import { createClient } from "@supabase/supabase-js"
import AdminHeader from "@/components/admin/admin-header"
import EditVideoForm from "@/components/admin/edit-video-form"

const supabaseAdmin = createClient(
  "https://znpcnzkaaokxpxqexksu.supabase.co",
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InpucGNuemthYW9reHB4cWV4a3N1Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc0MTIxNjc0MCwiZXhwIjoyMDU2NzkyNzQwfQ.PaOShOpz6Tg7s7RMrhe22Iqci3qZGVDZ5M0ajJIFNp0",
)

export default async function EditVideoPage({ params }: { params: { id: string } }) {
  const { data: video, error } = await supabaseAdmin.from("videos").select("*").eq("id", params.id).single()

  if (error) {
    console.error("Erreur lors de la récupération de la vidéo:", error)
    return <div>Erreur lors du chargement de la vidéo</div>
  }

  if (!video) {
    return <div>Vidéo non trouvée</div>
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <AdminHeader />

      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">Modifier la vidéo</h1>

        <div className="bg-white rounded-lg shadow-md p-6">
          <EditVideoForm video={video} />
        </div>
      </div>
    </div>
  )
}

