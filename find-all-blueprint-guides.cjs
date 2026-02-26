const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_KEY;

const supabase = createClient(supabaseUrl, supabaseKey);

function groupByDomain(data) {
  const byDomain = {};
  for (const item of data) {
    const domain = item.domain || 'No Domain';
    if (!byDomain[domain]) byDomain[domain] = [];
    byDomain[domain].push(item);
  }
  return byDomain;
}

function printDomainGroups(byDomain) {
  for (const domain of Object.keys(byDomain).sort((a, b) => a.localeCompare(b))) {
    console.log(`\n${domain} (${byDomain[domain].length} items):`);
    for (const item of byDomain[domain]) {
      console.log(`  - ${item.title} (${item.slug}) [${item.guide_type || 'no type'}]`);
    }
  }
}

async function findAllBlueprints() {
  try {
    const { data, error } = await supabase
      .from('guides')
      .select('id, slug, title, domain, guide_type, status')
      .order('title');

    if (error) { console.error('Error:', error); return; }

    console.log(`Total guides: ${data.length}\n`);
    printDomainGroups(groupByDomain(data));
  } catch (err) {
    console.error('Error:', err);
  }
}

findAllBlueprints();
