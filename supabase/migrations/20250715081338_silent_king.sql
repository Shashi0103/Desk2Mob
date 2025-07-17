/*
  # Create file shares table for secure file sharing

  1. New Tables
    - `file_shares`
      - `id` (uuid, primary key) - Unique identifier for each file share
      - `code` (text, unique) - 6-digit code for file access
      - `filename` (text) - Original filename
      - `file_size` (bigint) - File size in bytes
      - `file_type` (text) - MIME type of the file
      - `storage_path` (text) - Path to file in Supabase storage
      - `created_at` (timestamp) - When the file was uploaded
      - `expires_at` (timestamp) - When the file expires (10 minutes from upload)
      - `downloaded` (boolean) - Whether the file has been downloaded
      - `download_count` (integer) - Number of times downloaded (should be 0 or 1)

  2. Security
    - Enable RLS on `file_shares` table
    - Add policy for anyone to read file shares (for code validation)
    - Add policy for anyone to insert file shares (for uploads)
    - Add policy for anyone to update download status

  3. Storage
    - Create storage bucket for files
    - Set up policies for file access
*/

-- Create the file_shares table
CREATE TABLE IF NOT EXISTS file_shares (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  code text UNIQUE NOT NULL,
  filename text NOT NULL,
  file_size bigint NOT NULL,
  file_type text NOT NULL,
  storage_path text NOT NULL,
  created_at timestamptz DEFAULT now(),
  expires_at timestamptz NOT NULL,
  downloaded boolean DEFAULT false,
  download_count integer DEFAULT 0
);

-- Enable Row Level Security
ALTER TABLE file_shares ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Anyone can read file shares for code validation"
  ON file_shares
  FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Anyone can insert file shares"
  ON file_shares
  FOR INSERT
  TO public
  WITH CHECK (true);

CREATE POLICY "Anyone can update download status"
  ON file_shares
  FOR UPDATE
  TO public
  USING (true)
  WITH CHECK (true);

-- Create storage bucket for files
INSERT INTO storage.buckets (id, name, public) 
VALUES ('files', 'files', false)
ON CONFLICT (id) DO NOTHING;

-- Create storage policies
CREATE POLICY "Anyone can upload files"
  ON storage.objects
  FOR INSERT
  TO public
  WITH CHECK (bucket_id = 'files');

CREATE POLICY "Anyone can read files"
  ON storage.objects
  FOR SELECT
  TO public
  USING (bucket_id = 'files');

CREATE POLICY "Anyone can delete files"
  ON storage.objects
  FOR DELETE
  TO public
  USING (bucket_id = 'files');

-- Create index for faster code lookups
CREATE INDEX IF NOT EXISTS idx_file_shares_code ON file_shares(code);
CREATE INDEX IF NOT EXISTS idx_file_shares_expires_at ON file_shares(expires_at);
CREATE INDEX IF NOT EXISTS idx_file_shares_downloaded ON file_shares(downloaded);