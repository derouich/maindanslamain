import { cookies } from "next/headers"
import AdminHeader from "@/components/admin/admin-header"
import SectionVisibilityManager from "@/components/admin/section-visibility-manager"
import { getSectionVisibility } from "@/app/actions/section-visibility"
import AdminLoginForm from "@/components/admin-login-form"
import Logo from "@/components/logo"
import RefreshHomeButton from "@/components/admin/refresh-home-button"

export const revalidate = 0

export default async function AdminSectionsPage() {
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

  const sections = await getSectionVisibility()

  return (
    <div className="min-h-screen bg-gray-100">
      <AdminHeader />

      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">Gestion des Sections</h1>
          <RefreshHomeButton />
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <p className="text-gray-600 mb-6">
            Utilisez les interrupteurs ci-dessous pour afficher ou masquer les différentes sections du site. Les
            modifications sont appliquées immédiatement.
          </p>

          <SectionVisibilityManager sections={sections} />
        </div>
      </div>
    </div>
  )
}

