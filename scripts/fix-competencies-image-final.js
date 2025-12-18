import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config();

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Missing Supabase credentials in .env file');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

// COMPLETELY DIFFERENT image - team collaboration, values, culture - NOT dark laptop
// Using a different Unsplash photo ID that shows people/team/values
const VALUES_CULTURE_IMAGE = 'https://images.unsplash.com/photo-1521737604893-d14cc237f11d?q=80&w=2970&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D';

async function fixCompetenciesImage() {
  console.log('🔄 Fixing DQ Competencies image - replacing dark laptop with team/values image...\n');

  const slug = 'dq-competencies';

  try {
    // First check current image
    const { data: current } = await supabase
      .from('guides')
      .select('id, title, slug, hero_image_url')
      .eq('slug', slug)
      .maybeSingle();

    if (!current) {
      console.log(`⚠️  Guide not found: ${slug}`);
      return;
    }

    console.log(`📋 Current: ${current.title}`);
    console.log(`   Current image URL: ${current.hero_image_url?.substring(0, 80)}...\n`);

    // Update to new image
    const { data, error } = await supabase
      .from('guides')
      .update({
        hero_image_url: VALUES_CULTURE_IMAGE,
        last_updated_at: new Date().toISOString()
      })
      .eq('slug', slug)
      .select('id, title, slug, hero_image_url');

    if (error) {
      console.error(`❌ Error updating:`, error.message);
      return;
    }

    if (data && data.length > 0) {
      console.log(`✅ Successfully updated: ${data[0].title}`);
      console.log(`   New image URL: ${data[0].hero_image_url?.substring(0, 80)}...`);
      console.log(`\n   Image theme: Team collaboration/values (NOT dark laptop)`);
      console.log(`   This is a completely different photo ID from Unsplash`);
    }
  } catch (err) {
    console.error(`❌ Unexpected error:`, err);
  }
}

fixCompetenciesImage().catch(console.error);
