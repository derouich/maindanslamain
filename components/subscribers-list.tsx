"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Search, Download, Plus, Pencil, Trash2 } from "lucide-react"
import { toast } from "sonner"
import AddSubscriberForm from "./add-subscriber-form"
import EditSubscriberForm from "./edit-subscriber-form"
import { deleteSubscriber, exportSubscribersToCSV } from "@/app/actions"

// Update the Subscriber type to remove email
type Subscriber = {
  id: number
  name: string
  phone: string
  created_at: string
}

type SubscribersListProps = {
  subscribers: Subscriber[]
}

export default function SubscribersList({ subscribers: initialSubscribers }: SubscribersListProps) {
  const [subscribers, setSubscribers] = useState<Subscriber[]>(initialSubscribers)
  const [searchTerm, setSearchTerm] = useState("")
  const [sortField, setSortField] = useState<keyof Subscriber>("created_at")
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("desc")
  const [showAddForm, setShowAddForm] = useState(false)
  const [editingSubscriber, setEditingSubscriber] = useState<Subscriber | null>(null)
  const router = useRouter()

  // Mettre à jour l'état local lorsque les props changent
  useEffect(() => {
    setSubscribers(initialSubscribers)
    console.log("SubscribersList reçoit:", initialSubscribers.length, "abonnés")
  }, [initialSubscribers])

  // Update the filter function to remove email
  const filteredSubscribers = subscribers.filter((subscriber) => {
    const searchLower = searchTerm.toLowerCase()
    return subscriber.name.toLowerCase().includes(searchLower) || subscriber.phone.toLowerCase().includes(searchLower)
  })

  // Sort subscribers
  const sortedSubscribers = [...filteredSubscribers].sort((a, b) => {
    if (sortDirection === "asc") {
      return a[sortField] > b[sortField] ? 1 : -1
    } else {
      return a[sortField] < b[sortField] ? 1 : -1
    }
  })

  // Handle sort click
  const handleSort = (field: keyof Subscriber) => {
    if (field === sortField) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc")
    } else {
      setSortField(field)
      setSortDirection("asc")
    }
  }

  // Format date
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("fr-FR", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  // Handle delete subscriber
  const handleDelete = async (id: number) => {
    if (confirm("Êtes-vous sûr de vouloir supprimer cet abonné ?")) {
      const formData = new FormData()
      formData.append("id", id.toString())

      const result = await deleteSubscriber(formData)

      if (result.success) {
        toast.success("Abonné supprimé avec succès !")
        // Mettre à jour l'état local
        setSubscribers((prev) => prev.filter((sub) => sub.id !== id))
        router.refresh()
      } else {
        toast.error(result.message || "Une erreur s'est produite. Veuillez réessayer.")
      }
    }
  }

  // Handle export to CSV
  const handleExport = async () => {
    const result = await exportSubscribersToCSV()

    if (result.success) {
      // Create a blob from the CSV content
      const blob = new Blob([result.csvContent], { type: "text/csv;charset=utf-8;" })

      // Create a download link
      const link = document.createElement("a")
      const url = URL.createObjectURL(blob)
      link.setAttribute("href", url)
      link.setAttribute("download", result.fileName)
      link.style.visibility = "hidden"
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)

      toast.success("Export CSV réussi !")
    } else {
      toast.error(result.message || "Une erreur s'est produite lors de l'exportation.")
    }
  }

  // Fonction pour gérer le succès de l'ajout d'un abonné
  const handleAddSuccess = (newSubscriber: Subscriber) => {
    // Add the new subscriber to the beginning of the list
    setSubscribers((prev) => [newSubscriber, ...prev])
    setShowAddForm(false)

    // Force a refresh to ensure the server data is updated
    setTimeout(() => {
      router.refresh()
    }, 500)
  }

  // Fonction pour gérer le succès de la modification d'un abonné
  const handleEditSuccess = (updatedSubscriber: Subscriber) => {
    setSubscribers((prev) => prev.map((sub) => (sub.id === updatedSubscriber.id ? updatedSubscriber : sub)))
    setEditingSubscriber(null)
    router.refresh()
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500" />
          <Input
            type="text"
            placeholder="Rechercher par nom, email ou téléphone..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 text-black"
          />
        </div>
        <div className="flex gap-2">
          <Button
            onClick={() => setShowAddForm(!showAddForm)}
            className="text-white bg-emerald-600 hover:bg-emerald-700"
          >
            <Plus className="w-4 h-4 mr-2" />
            {showAddForm ? "Masquer" : "Ajouter un abonné"}
          </Button>
          <Button
            onClick={handleExport}
            className="text-white bg-blue-600 hover:bg-blue-700"
            disabled={subscribers.length === 0}
          >
            <Download className="w-4 h-4 mr-2" />
            Exporter CSV
          </Button>
        </div>
      </div>

      {showAddForm && (
        <div className="p-4 bg-gray-50 rounded-md">
          <h3 className="mb-4 text-xl font-semibold">Ajouter un nouvel abonné</h3>
          <AddSubscriberForm onSuccess={handleAddSuccess} />
        </div>
      )}

      {editingSubscriber && (
        <div className="p-4 bg-gray-50 rounded-md">
          <h3 className="mb-4 text-xl font-semibold">Modifier l'abonné</h3>
          <EditSubscriberForm subscriber={editingSubscriber} onSuccess={handleEditSuccess} />
          <Button onClick={() => setEditingSubscriber(null)} variant="outline" className="mt-4">
            Annuler
          </Button>
        </div>
      )}

      <div className="border rounded-md">
        // Update the table header to remove the email column
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="cursor-pointer hover:bg-gray-50" onClick={() => handleSort("name")}>
                Nom {sortField === "name" && (sortDirection === "asc" ? "↑" : "↓")}
              </TableHead>
              <TableHead className="cursor-pointer hover:bg-gray-50" onClick={() => handleSort("phone")}>
                Téléphone {sortField === "phone" && (sortDirection === "asc" ? "↑" : "↓")}
              </TableHead>
              <TableHead className="cursor-pointer hover:bg-gray-50" onClick={() => handleSort("created_at")}>
                Date d'inscription {sortField === "created_at" && (sortDirection === "asc" ? "↑" : "↓")}
              </TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          // Update the table rows to remove the email column
          <TableBody>
            {sortedSubscribers.length > 0 ? (
              sortedSubscribers.map((subscriber) => (
                <TableRow key={subscriber.id}>
                  <TableCell className="font-medium">{subscriber.name}</TableCell>
                  <TableCell>{subscriber.phone}</TableCell>
                  <TableCell>{formatDate(subscriber.created_at)}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button
                        onClick={() => setEditingSubscriber(subscriber)}
                        size="sm"
                        className="text-white bg-amber-500 hover:bg-amber-600"
                      >
                        <Pencil className="w-4 h-4" />
                        <span className="sr-only">Modifier</span>
                      </Button>
                      <Button
                        onClick={() => handleDelete(subscriber.id)}
                        size="sm"
                        className="text-white bg-red-500 hover:bg-red-600"
                      >
                        <Trash2 className="w-4 h-4" />
                        <span className="sr-only">Supprimer</span>
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={4} className="text-center py-6 text-gray-500">
                  {searchTerm ? "Aucun résultat trouvé" : "Aucun inscrit pour le moment"}
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <p className="text-sm text-gray-500">
        {filteredSubscribers.length} {filteredSubscribers.length > 1 ? "inscrits" : "inscrit"} {searchTerm && "trouvés"}
      </p>
    </div>
  )
}

