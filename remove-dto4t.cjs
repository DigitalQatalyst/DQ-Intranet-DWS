const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://jmhtrffmxjxhoxpesubv.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImptaHRyZmZteGp4aG94cGVzdWJ2Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2MjQ3NjcyNCwiZXhwIjoyMDc4MDUyNzI0fQ.-J_U8VUD76zJImZ9WBMhjGLdCQhGQ2zo5ZL2L9ef8jI';

const supabase = createClient(supabaseUrl, supabaseKey);

async function removeDTO4T() {
  try {
    // First, check if DTO4T exists
    const { data: existing, error: fetchError } = await supabase
      .from('guides')
      .select('id, slug, title')
      .ilike('slug', '%dto4t%');

    if (fetchError) {
      console.log('Error fetching:', fetchError.message);
      return;
    }

    if (!existing || existing.length === 0) {
      console.log('DTO4T not found');
      return;
    }

    console.log('Found DTO4T records:', existing);

    // Delete all matching records
    for (const record of existing) {
      const { error: deleteError } = await supabase
        .from('guides')
        .delete()
        .eq('id', record.id);

      if (deleteError) {
        console.error(`Error deleting ${record.slug}:`, deleteError);
      } else {
        console.log(`✅ Successfully deleted ${record.slug}!`);
      }
    }
  } catch (err) {
    console.error('Error:', err);
  }
}

removeDTO4T();
