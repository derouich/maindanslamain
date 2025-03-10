-- Create a backup of the current subscribers table
CREATE TABLE IF NOT EXISTS subscribers_backup AS
SELECT * FROM subscribers;

-- Drop the email constraint if it exists
ALTER TABLE subscribers DROP CONSTRAINT IF EXISTS subscribers_email_key;

-- Remove the email column
ALTER TABLE subscribers DROP COLUMN IF EXISTS email;

-- Make sure the phone column is unique
ALTER TABLE subscribers ADD CONSTRAINT subscribers_phone_key UNIQUE (phone);

-- Log the change
INSERT INTO migration_logs (migration_name, description, executed_at)
VALUES ('remove_email_from_subscribers', 'Removed email column from subscribers table', NOW())
ON CONFLICT DO NOTHING;

