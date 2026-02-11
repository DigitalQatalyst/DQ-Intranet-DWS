const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://jmhtrffmxjxhoxpesubv.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImptaHRyZmZteGp4aG94cGVzdWJ2Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2MjQ3NjcyNCwiZXhwIjoyMDc4MDUyNzI0fQ.-J_U8VUD76zJImZ9WBMhjGLdCQhGQ2zo5ZL2L9ef8jI';

const supabase = createClient(supabaseUrl, supabaseKey);

async function fixContent() {
  try {
    const { data: guide, error: fetchError } = await supabase
      .from('guides')
      .select('body')
      .eq('slug', 'dq-competencies-emotional-intelligence')
      .single();

    if (fetchError) {
      console.error('Error fetching guide:', fetchError);
      return;
    }

    console.log('Current body preview:', guide.body.substring(0, 300));

    // Remove the "# Introduction" heading at the start
    let updatedBody = guide.body.replace(/^#\s+Introduction\s*\n+/m, '');

    console.log('\nUpdated body preview:', updatedBody.substring(0, 300));

    // Update the guide
    const { data, error } = await supabase
      .from('guides')
      .update({ body: updatedBody })
      .eq('slug', 'dq-competencies-emotional-intelligence')
      .select();

    if (error) {
      console.error('Error updating guide:', error);
    } else {
      console.log('\n✅ Successfully updated Emotional Intelligence guide');
    }
  } catch (err) {
    console.error('Error:', err);
  }
}

fixContent();
