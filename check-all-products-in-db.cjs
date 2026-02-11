const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://jmhtrffmxjxhoxpesubv.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImptaHRyZmZteGp4aG94cGVzdWJ2Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2MjQ3NjcyNCwiZXhwIjoyMDc4MDUyNzI0fQ.-J_U8VUD76zJImZ9WBMhjGLdCQhGQ2zo5ZL2L9ef8jI';

const supabase = createClient(supabaseUrl, supabaseKey);

async function checkAllProducts() {
  try {
    // Search for all products that might be shown on blueprints page
    const { data, error } = await supabase
      .from('guides')
      .select('id, slug, title, domain, guide_type, status')
      .or('title.ilike.%dtmp%,title.ilike.%dto4t%,title.ilike.%tmaas%,title.ilike.%dtma%,title.ilike.%dtmb%,title.ilike.%dtmi%,title.ilike.%plant%');

    if (error) {
      console.error('Error:', error);
      return;
    }

    console.log('Found products:');
    data.forEach(item => {
      console.log(`\n- Title: ${item.title}`);
      console.log(`  Slug: ${item.slug}`);
      console.log(`  Domain: ${item.domain}`);
      console.log(`  Type: ${item.guide_type}`);
      console.log(`  Status: ${item.status}`);
      console.log(`  ID: ${item.id}`);
    });

    console.log(`\n\nTotal found: ${data.length}`);
  } catch (err) {
    console.error('Error:', err);
  }
}

checkAllProducts();
