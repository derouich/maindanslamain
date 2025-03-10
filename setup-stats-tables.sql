-- Activer l'extension uuid-ossp si elle n'est pas déjà activée
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Création de la table pour les vidéos
CREATE TABLE IF NOT EXISTS videos (
id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
title TEXT NOT NULL,
description TEXT,
category TEXT NOT NULL,
url TEXT NOT NULL,
thumbnail_url TEXT,
file_name TEXT NOT NULL,
thumbnail_file_name TEXT,
created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

-- Création de la table pour les vues de page
CREATE TABLE IF NOT EXISTS page_views (
id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
path TEXT NOT NULL,
ip_hash TEXT NOT NULL,
user_agent TEXT,
referer TEXT,
created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

-- Création de la table pour les vues de vidéo
CREATE TABLE IF NOT EXISTS video_views (
id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
video_id UUID NOT NULL,
ip_hash TEXT NOT NULL,
user_agent TEXT,
created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
FOREIGN KEY (video_id) REFERENCES videos(id) ON DELETE CASCADE
);

-- Création de la table pour les lectures de vidéo
CREATE TABLE IF NOT EXISTS video_plays (
id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
video_id UUID NOT NULL,
ip_hash TEXT NOT NULL,
user_agent TEXT,
created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
FOREIGN KEY (video_id) REFERENCES videos(id) ON DELETE CASCADE
);

-- Création d'index pour améliorer les performances des requêtes
CREATE INDEX IF NOT EXISTS idx_page_views_created_at ON page_views(created_at);
CREATE INDEX IF NOT EXISTS idx_video_views_video_id ON video_views(video_id);
CREATE INDEX IF NOT EXISTS idx_video_views_created_at ON video_views(created_at);
CREATE INDEX IF NOT EXISTS idx_video_plays_video_id ON video_plays(video_id);
CREATE INDEX IF NOT EXISTS idx_video_plays_created_at ON video_plays(created_at);

-- Création de politiques RLS pour les tables
ALTER TABLE videos ENABLE ROW LEVEL SECURITY;
ALTER TABLE page_views ENABLE ROW LEVEL SECURITY;
ALTER TABLE video_views ENABLE ROW LEVEL SECURITY;
ALTER TABLE video_plays ENABLE ROW LEVEL SECURITY;

-- Politique pour permettre l'insertion par n'importe qui
CREATE POLICY IF NOT EXISTS "Allow anonymous page views" ON page_views
FOR INSERT WITH CHECK (true);

CREATE POLICY IF NOT EXISTS "Allow anonymous video views" ON video_views
FOR INSERT WITH CHECK (true);

CREATE POLICY IF NOT EXISTS "Allow anonymous video plays" ON video_plays
FOR INSERT WITH CHECK (true);

-- Politique pour permettre la lecture par le service role uniquement
CREATE POLICY IF NOT EXISTS "Allow service role to read page views" ON page_views
FOR SELECT USING (auth.role() = 'service_role');

CREATE POLICY IF NOT EXISTS "Allow service role to read video views" ON video_views
FOR SELECT USING (auth.role() = 'service_role');

CREATE POLICY IF NOT EXISTS "Allow service role to read video plays" ON video_plays
FOR SELECT USING (auth.role() = 'service_role');

-- Politique pour les vidéos
CREATE POLICY IF NOT EXISTS "Allow service role to manage videos" ON videos
FOR ALL USING (auth.role() = 'service_role');

CREATE POLICY IF NOT EXISTS "Allow public to read videos" ON videos
FOR SELECT USING (true);

-- Créer des buckets de stockage pour les vidéos et les miniatures si nécessaire
DO $$
BEGIN
IF NOT EXISTS (SELECT 1 FROM storage.buckets WHERE id = 'videos') THEN
  INSERT INTO storage.buckets (id, name, public) VALUES ('videos', 'videos', true);
END IF;

IF NOT EXISTS (SELECT 1 FROM storage.buckets WHERE id = 'thumbnails') THEN
  INSERT INTO storage.buckets (id, name, public) VALUES ('thumbnails', 'thumbnails', true);
END IF;
END $$;

-- Politique pour permettre l'accès public aux fichiers vidéo et miniatures
BEGIN;
DROP POLICY IF EXISTS "Allow public access to videos" ON storage.objects;
CREATE POLICY "Allow public access to videos" ON storage.objects
FOR SELECT USING (bucket_id = 'videos');
COMMIT;

BEGIN;
DROP POLICY IF EXISTS "Allow public access to thumbnails" ON storage.objects;
CREATE POLICY "Allow public access to thumbnails" ON storage.objects
FOR SELECT USING (bucket_id = 'thumbnails');
COMMIT;

-- Politique pour permettre au service role de gérer les fichiers
BEGIN;
DROP POLICY IF EXISTS "Allow service role to manage video files" ON storage.objects;
CREATE POLICY "Allow service role to manage video files" ON storage.objects
FOR ALL USING (auth.role() = 'service_role');
COMMIT;

