import { createClient } from "@supabase/supabase-js"

// Hardcoded values for debugging purposes
const supabaseUrl = "https://znpcnzkaaokxpxqexksu.supabase.co"
const supabaseAnonKey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InpucGNuemthYW9reHB4cWV4a3N1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDEyMTY3NDAsImV4cCI6MjA1Njc5Mjc0MH0.GjK-EtRBFVGcqrfBYvwwSj_0UYYfKlUKr4BQI8Zv7oY"
const supabaseServiceKey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InpucGNuemthYW9reHB4cWV4a3N1Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc0MTIxNjc0MCwiZXhwIjoyMDU2NzkyNzQwfQ.PaOShOpz6Tg7s7RMrhe22Iqci3qZGVDZ5M0ajJIFNp0"

// Créer les clients Supabase
export const supabase = createClient(supabaseUrl, supabaseAnonKey)
export const supabaseClient = supabase // Alias pour la compatibilité avec le code existant

// Client avec la clé de service (pour les opérations côté serveur)
export const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey)

// Fonction utilitaire pour obtenir le client approprié
export function getSupabase(useAdmin = false) {
  return useAdmin ? supabaseAdmin : supabase
}

