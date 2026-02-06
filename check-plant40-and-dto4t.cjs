const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://jmhtrffmxjxhoxpesubv.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImptaHRyZmZteGp4aG94cGVzdWJ2Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2MjQ3NjcyNCwiZXhwIjoyMDc4MDUyNzI0fQ.-J_U8VUD76zJImZ9WBMhjGLdCQhGQ2zo5ZL2L9ef8jI';

const supabase = createClient(supabaseUrl, supabaseKey);

async function checkProducts() {
  try {
    // Get all products
    const { data, error } = await supabase
      .from('guides')
      .select('id, slug, title, domain, guide_type, status')
      .or('title.ilike.%plant%,title.ilike.%dto4t%,title.ilike.%dtmp%,title.ilike.%tmaas%');

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
    });

    // Now let's check what DTO4T looks like
    const { data: dto4t, error: dto4tError } = await supabase
      .from('guides')
      .select('*')
      .ilike('title', '%dto4t%')
      .single();

    if (!dto4tError && dto4t) {
      console.log('\n\nDTO4T full record:');
      console.log(JSON.stringify(dto4t, null, 2));
    }
  } catch (err) {
    console.error('Error:', err);
  }
}

checkProducts();
