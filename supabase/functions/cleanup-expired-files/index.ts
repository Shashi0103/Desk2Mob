import { supabase } from 'https://esm.sh/@supabase/supabase-js@2.39.0';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface FileShare {
  id: string;
  storage_path: string;
  expires_at: string;
  downloaded: boolean;
}

Deno.serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const supabaseClient = supabase(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    );

    // Get all expired files
    const { data: expiredFiles, error: fetchError } = await supabaseClient
      .from('file_shares')
      .select('id, storage_path, expires_at, downloaded')
      .or('expires_at.lt.now(),downloaded.eq.true');

    if (fetchError) {
      throw fetchError;
    }

    if (!expiredFiles || expiredFiles.length === 0) {
      return new Response(
        JSON.stringify({ message: 'No expired files to clean up' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const results = [];
    
    for (const file of expiredFiles) {
      try {
        // Delete from storage
        const { error: storageError } = await supabaseClient.storage
          .from('files')
          .remove([file.storage_path]);

        if (storageError) {
          console.error(`Failed to delete file from storage: ${file.storage_path}`, storageError);
          continue;
        }

        // Delete from database
        const { error: dbError } = await supabaseClient
          .from('file_shares')
          .delete()
          .eq('id', file.id);

        if (dbError) {
          console.error(`Failed to delete file record: ${file.id}`, dbError);
          continue;
        }

        results.push({
          id: file.id,
          storage_path: file.storage_path,
          status: 'deleted',
          reason: new Date(file.expires_at) < new Date() ? 'expired' : 'downloaded'
        });

      } catch (error) {
        console.error(`Error processing file ${file.id}:`, error);
        results.push({
          id: file.id,
          storage_path: file.storage_path,
          status: 'error',
          error: error.message
        });
      }
    }

    return new Response(
      JSON.stringify({ 
        message: `Cleaned up ${results.length} files`,
        results 
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Cleanup function error:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  }
});