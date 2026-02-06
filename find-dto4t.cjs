const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://jmhtrffmxjxhoxpesubv.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImptaHRyZmZteGp4aG94cGVzdWJ2Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2MjQ3NjcyNCwiZXhwIjoyMDc4MDUyNzI0fQ.-J_U8VUD76zJImZ9WBMhjGLdCQhGQ2zo5ZL2L9ef8jI';

const supabase = createClient(supabaseUrl, supabaseKey);

async function findDTO4T() {
  try {
    // Get all blueprint products
    const { data, error } = await supabase
      .from('guides')
      .select('id, slug, title')
      .eq('guide_type', 'blueprint');

    if (error) {
      console.error('Error:', error);
      return;
    }

    console.log('All blueprint products:');
    data.forEach(item => {
      console.log(`- ${item.title} (${item.slug})`);
    });
  } catch (err) {
    console.error('Error:', err);
  }
}

findDTO4T();
