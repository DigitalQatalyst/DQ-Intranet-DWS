const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://jmhtrffmxjxhoxpesubv.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImptaHRyZmZteGp4aG94cGVzdWJ2Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2MjQ3NjcyNCwiZXhwIjoyMDc4MDUyNzI0fQ.-J_U8VUD76zJImZ9WBMhjGLdCQhGQ2zo5ZL2L9ef8jI';

const supabase = createClient(supabaseUrl, supabaseKey);

async function checkContent() {
  try {
    const { data: guide, error } = await supabase
      .from('guides')
      .select('body')
      .eq('slug', 'dq-competencies-emotional-intelligence')
      .single();

    if (error) {
      console.error('Error:', error);
      return;
    }

    console.log('First 800 characters of body:');
    console.log(guide.body.substring(0, 800));
    console.log('\n---\n');
  } catch (err) {
    console.error('Error:', err);
  }
}

checkContent();
