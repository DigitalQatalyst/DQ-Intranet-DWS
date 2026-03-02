import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config();

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_JWT_SECRET;

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Missing Supabase credentials in .env file');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

const VISION_MISSION_SLUGS = [
  'dq-vision-and-mission', 'dq-vision-mission', 'dq-vision',
  'dq-mission', 'vision-and-mission', 'vision-mission'
];

const VISION_MISSION_TITLES = ['vision', 'mission', 'dq vision', 'dq mission'];

const HISTORY_KEYWORDS = [
  'where dq began', 'dq began', 'dq origin', 'dq history',
  'dq founding', 'dq started', 'dq beginning', 'how dq started',
  'dq story', 'dq evolution'
];

function deduplicateById(guides) {
  return guides.filter((g, i, self) => i === self.findIndex(x => x.id === g.id));
}

async function addSubDomainTag(guide, tag) {
  const subDomains = (guide.sub_domain || '').split(',').map(s => s.trim()).filter(Boolean);
  if (subDomains.includes(tag)) {
    console.log(`   ⏭️  ${guide.title} already has "${tag}" in sub_domain`);
    return;
  }
  subDomains.push(tag);
  const newSubDomain = subDomains.join(',');
  const { error } = await supabase.from('guides').update({ sub_domain: newSubDomain }).eq('id', guide.id);
  if (error) {
    console.error(`   ❌ Failed to update ${guide.title}:`, error);
  } else {
    console.log(`   ✅ Updated ${guide.title}: sub_domain = "${newSubDomain}"`);
  }
}

async function applySubDomainTag(guides, tag) {
  for (const guide of guides) {
    await addSubDomainTag(guide, tag);
  }
}

/**
 * Update guides to categorize them under "journey" or "history" sub_domain
 *
 * Journey: Vision and Mission related guides
 * History: Guides about where DQ began, DQ origin, DQ history
 */
async function updateStrategySubdomains() {
  console.log('🔍 Searching for guides to categorize...\n');

  try {
    console.log('📋 Step 1: Finding Vision & Mission guides for "journey" category...');
    const [{ data: bySlug, error: e1 }, { data: byTitle, error: e2 }] = await Promise.all([
      supabase.from('guides').select('id, slug, title, sub_domain, domain').in('slug', VISION_MISSION_SLUGS),
      supabase.from('guides').select('id, slug, title, sub_domain, domain').or(VISION_MISSION_TITLES.map(t => `title.ilike.%${t}%`).join(',')),
    ]);
    if (e1) console.error('Error fetching by slug:', e1);
    if (e2) console.error('Error fetching by title:', e2);
    const allVisionMissionGuides = deduplicateById([...(bySlug || []), ...(byTitle || [])]);
    console.log(`   Found ${allVisionMissionGuides.length} Vision/Mission guide(s):`);
    allVisionMissionGuides.forEach(g => console.log(`   - ${g.title} (${g.slug})`));
    await applySubDomainTag(allVisionMissionGuides, 'journey');

    console.log('\n📋 Step 2: Finding History guides for "history" category...');
    const [{ data: byKeyword, error: e3 }, { data: byHistorySlug, error: e4 }] = await Promise.all([
      supabase.from('guides').select('id, slug, title, sub_domain, domain, summary').or(HISTORY_KEYWORDS.map(k => `title.ilike.%${k}%,summary.ilike.%${k}%`).join(',')),
      supabase.from('guides').select('id, slug, title, sub_domain, domain').ilike('slug', '%history%'),
    ]);
    if (e3) console.error('Error fetching history guides:', e3);
    if (e4) console.error('Error fetching history guides by slug:', e4);
    const allHistoryGuides = deduplicateById([...(byKeyword || []), ...(byHistorySlug || [])]);
    console.log(`   Found ${allHistoryGuides.length} History guide(s):`);
    allHistoryGuides.forEach(g => console.log(`   - ${g.title} (${g.slug})`));
    await applySubDomainTag(allHistoryGuides, 'history');

    console.log('\n✅ Update complete!');
    console.log(`\n📊 Summary:`);
    console.log(`   - Vision/Mission guides updated: ${allVisionMissionGuides.length}`);
    console.log(`   - History guides updated: ${allHistoryGuides.length}`);

  } catch (error) {
    console.error('❌ Error updating guides:', error);
    process.exit(1);
  }
}

// Run the update
updateStrategySubdomains();

