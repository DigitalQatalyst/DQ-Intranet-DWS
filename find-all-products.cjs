const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://jmhtrffmxjxhoxpesubv.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImptaHRyZmZteGp4aG94cGVzdWJ2Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2MjQ3NjcyNCwiZXhwIjoyMDc4MDUyNzI0fQ.-J_U8VUD76zJImZ9WBMhjGLdCQhGQ2zo5ZL2L9ef8jI';

const supabase = createClient(supabaseUrl, supabaseKey);

async function findAllProducts() {
  try {
    // Get all products in the Products domain
    const { data, error } = await supabase
      .from('guides')
      .select('id, slug, title, domain, guide_type')
      .eq('domain', 'Products');

    if (error) {
      console.error('Error:', error);
      return;
    }

    console.log('All products in Products domain:');
    data.forEach(item => {
      console.log(`- ${item.title} (${item.slug}) - Type: ${item.guide_type}`);
    });
  } catch (err) {
    console.error('Error:', err);
  }
}

findAllProducts();
