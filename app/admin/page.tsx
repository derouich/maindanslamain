import { cookies } from "next/headers"
import AdminLoginForm from "@/components/admin-login-form"
import Logo from "@/components/logo"
import AdminHeader from "@/components/admin/admin-header"
import DashboardCards from "@/components/admin/dashboard-cards"

export default async function AdminPage() {
  const isAuthenticated = cookies().get("admin_authenticated")?.value === "true"

  if (!isAuthenticated) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <div className="w-full max-w-md p-8 bg-white rounded-lg shadow-md">
          <div className="flex justify-center mb-4">
            <Logo size="lg" white={false} />
          </div>
          <h1 className="mb-6 text-2xl font-bold text-center text-gray-800">Accès Administrateur MainDansLaMain</h1>
          <AdminLoginForm />
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <AdminHeader />

      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">Tableau de Bord</h1>

        <DashboardCards />

        <div className="mt-8 p-6 bg-white rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4">Bienvenue dans l'administration</h2>
          <p className="text-gray-600">
            Utilisez les cartes ci-dessus ou le menu de navigation pour accéder aux différentes fonctionnalités
            d'administration.
          </p>
        </div>
      </div>
    </div>
  )
}

