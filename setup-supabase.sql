-- Création de la table subscribers si elle n'existe pas
CREATE TABLE IF NOT EXISTS subscribers (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL UNIQUE,
  phone TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

-- Création d'une politique RLS pour permettre l'insertion par n'importe qui
ALTER TABLE subscribers ENABLE ROW LEVEL SECURITY;

-- Politique pour permettre l'insertion par n'importe qui
CREATE POLICY "Allow anonymous inserts" ON subscribers
  FOR INSERT WITH CHECK (true);

-- Politique pour permettre la lecture par le service role uniquement
CREATE POLICY "Allow service role to read" ON subscribers
  FOR SELECT USING (auth.role() = 'service_role');

-- Politique pour permettre la mise à jour par le service role uniquement
CREATE POLICY "Allow service role to update" ON subscribers
  FOR UPDATE USING (auth.role() = 'service_role');

-- Politique pour permettre la suppression par le service role uniquement
CREATE POLICY "Allow service role to delete" ON subscribers
  FOR DELETE USING (auth.role() = 'service_role');

