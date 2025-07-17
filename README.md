# Desk2Mob Share - Secure and Fast File Sharing App

A modern, secure file-sharing application with glassmorphism UI effects, built with React, TypeScript, and Supabase.

## Features

- **Secure File Sharing**: Upload files and share them with unique 6-digit codes
- **QR Code Support**: Generate QR codes for easy file sharing
- **Automatic Expiration**: Files expire after 10 minutes or single download
- **Glassmorphism UI**: Modern design with frosted glass effects
- **Responsive Design**: Works perfectly on mobile and desktop
- **Real-time Progress**: Upload progress tracking
- **Cloud Storage**: Powered by Supabase for reliable file storage

## Tech Stack

- **Frontend**: React 18, TypeScript, Tailwind CSS
- **Backend**: Supabase (Database, Storage, Edge Functions)
- **Routing**: React Router DOM
- **QR Codes**: qrcode.react
- **Icons**: Lucide React

## Setup Instructions

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd fileshare-app
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up Supabase**
   - Create a new project at [supabase.com](https://supabase.com)
   - Copy your project URL and anon key
   - Create a `.env` file from `.env.example`
   - Add your Supabase credentials

4. **Run database migrations**
   - In your Supabase dashboard, go to SQL Editor
   - Run the migration from `supabase/migrations/create_file_shares_table.sql`

5. **Deploy Edge Function (Optional)**
   - The cleanup function in `supabase/functions/cleanup-expired-files/` can be deployed to automatically clean up expired files
   - Set up a cron job to run this function periodically

6. **Start the development server**
   ```bash
   npm run dev
   ```

## Environment Variables

Create a `.env` file in the root directory:

```env
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
```

## Usage

1. **Send Files**: Upload a file and get a 6-digit code and QR code
2. **Receive Files**: Enter the code or scan QR code to download
3. **Automatic Cleanup**: Files are automatically deleted after 10 minutes or single download

## Security Features

- Files are stored securely in Supabase Storage
- Unique 6-digit codes for each file
- Automatic expiration after 10 minutes
- Single download limitation
- No permanent storage of files

## License

MIT License - see LICENSE file for details