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

async function checkStrategyGuides() {
  console.log('🔍 Checking Strategy guides...\n');

  const { data: guides, error } = await supabase
    .from('guides')
    .select('id, title, summary, body, sub_domain, domain, guide_type, unit, location')
    .eq('status', 'Approved');

  if (error) {
    console.error('❌ Error fetching guides:', error);
    return;
  }

  // Filter for Strategy guides
  const strategy = (guides || []).filter(g => {
    const domain = (g.domain || '').toLowerCase();
    const guideType = (g.guide_type || '').toLowerCase();
    return domain.includes('strategy') || guideType.includes('strategy');
  });

  console.log(`📊 Found ${strategy.length} Strategy guides\n`);

  // Group by sub_domain (which contains journey, history, etc.)
  const byCategory = {};
  strategy.forEach(g => {
    const category = g.sub_domain || 'uncategorized';
    if (!byCategory[category]) byCategory[category] = [];
    byCategory[category].push(g);
  });

  console.log('📋 Strategy guides by category:\n');
  Object.entries(byCategory).forEach(([category, guides]) => {
    console.log(`${category || 'No category'}: ${guides.length} guides`);
    guides.forEach(g => {
      console.log(`   - ${g.title}`);
    });
    console.log('');
  });

  // Check for Journey specifically
  const journeyGuides = strategy.filter(g => {
    const subDomain = (g.sub_domain || '').toLowerCase();
    const title = (g.title || '').toLowerCase();
    return subDomain.includes('journey') || title.includes('journey');
  });

  console.log(`\n📋 Journey guides: ${journeyGuides.length}`);
  journeyGuides.forEach(g => {
    console.log(`   - ${g.title}`);
    console.log(`     Sub-Domain: ${g.sub_domain || 'N/A'}`);
    console.log(`     Summary: ${(g.summary || '').substring(0, 100)}...`);
    console.log('');
  });
}

checkStrategyGuides().catch(console.error);

