-- Create a table for section visibility settings
CREATE TABLE IF NOT EXISTS section_visibility (
  id SERIAL PRIMARY KEY,
  section_id TEXT NOT NULL UNIQUE,
  section_name TEXT NOT NULL,
  is_visible BOOLEAN NOT NULL DEFAULT true,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

-- Insert default values for all sections
INSERT INTO section_visibility (section_id, section_name, is_visible)
VALUES
  ('paris-event', 'Formation Paris', true),
  ('hero', 'Voyage Spirituel', true),
  ('videos', 'Vidéos', true),
  ('instagram', 'Instagram', true),
  ('subscription', 'Inscription', true),
  ('social-links', 'Réseaux Sociaux', true)
ON CONFLICT (section_id) DO NOTHING;

-- Set up RLS policies
ALTER TABLE section_visibility ENABLE ROW LEVEL SECURITY;

-- Allow service role to manage section visibility
CREATE POLICY "Allow service role to manage section visibility" ON section_visibility
FOR ALL USING (auth.role() = 'service_role');

-- Allow anyone to read section visibility
CREATE POLICY "Allow public to read section visibility" ON section_visibility
FOR SELECT USING (true);

