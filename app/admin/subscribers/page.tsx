import { getSubscribers } from "@/app/actions"
import AdminHeader from "@/components/admin/admin-header"
import SubscribersList from "@/components/subscribers-list"

// Désactiver le cache pour cette page
export const revalidate = 0

export default async function AdminSubscribersPage() {
  // Récupérer les abonnés avec le cache désactivé
  const subscribers = await getSubscribers()

  console.log("Abonnés récupérés dans la page admin:", subscribers.length)

  return (
    <div className="min-h-screen bg-gray-100">
      <AdminHeader />

      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">Gestion des Abonnés</h1>

        <div className="bg-white rounded-lg shadow-md p-6">
          <SubscribersList subscribers={subscribers} />
        </div>
      </div>
    </div>
  )
}

