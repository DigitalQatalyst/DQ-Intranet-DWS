// Script to check RLS policies specifically for news and jobs tables
require('dotenv').config();

const { createClient } = require('@supabase/supabase-js');

async function checkNewsJobsRLS() {
  if (!process.env.VITE_SUPABASE_URL || !process.env.VITE_SUPABASE_ANON_KEY) {
    console.log('❌ Missing environment variables');
    return;
  }

  const supabase = createClient(
    process.env.VITE_SUPABASE_URL,
    process.env.VITE_SUPABASE_ANON_KEY
  );

  console.log('=== Checking News & Jobs Table Access ===');

  // Test news table access
  console.log('\n📰 Testing NEWS table access:');
  try {
    const { data: newsData, error: newsError, count: newsCount } = await supabase
      .from('news')
      .select('*', { count: 'exact' })
      .limit(1);

    if (newsError) {
      console.log('   ❌ News access failed:', newsError.message);
      console.log('   Code:', newsError.code);
      console.log('   Details:', newsError.details);
    } else {
      console.log(`   ✅ News access success! Found ${newsCount || 0} items`);
      if (newsData && newsData.length > 0) {
        console.log('   Sample news ID:', newsData[0].id);
      }
    }
  } catch (error) {
    console.error('   ❌ News test error:', error.message);
  }

  // Test jobs table access
  console.log('\n💼 Testing JOBS table access:');
  try {
    const { data: jobsData, error: jobsError, count: jobsCount } = await supabase
      .from('jobs')
      .select('*', { count: 'exact' })
      .limit(1);

    if (jobsError) {
      console.log('   ❌ Jobs access failed:', jobsError.message);
      console.log('   Code:', jobsError.code);
      console.log('   Details:', jobsError.details);
    } else {
      console.log(`   ✅ Jobs access success! Found ${jobsCount || 0} items`);
      if (jobsData && jobsData.length > 0) {
        console.log('   Sample job ID:', jobsData[0].id);
      }
    }
  } catch (error) {
    console.error('   ❌ Jobs test error:', error.message);
  }

  // Test if tables exist at all
  console.log('\n🔍 Checking if tables exist:');
  try {
    const { data: tables, error: tablesError } = await supabase
      .from('information_schema.tables')
      .select('table_name')
      .eq('table_schema', 'public')
      .in('table_name', ['news', 'jobs']);

    if (tablesError) {
      console.log('   ❌ Cannot check table existence:', tablesError.message);
    } else {
      const foundTables = tables?.map(t => t.table_name) || [];
      console.log('   Found tables:', foundTables.join(', ') || 'None');
      
      if (!foundTables.includes('news')) {
        console.log('   ⚠️  NEWS table does not exist!');
      }
      if (!foundTables.includes('jobs')) {
        console.log('   ⚠️  JOBS table does not exist!');
      }
    }
  } catch (error) {
    console.error('   ❌ Table existence check error:', error.message);
  }

  console.log('\n🔧 RECOMMENDATIONS:');
  console.log('1. If tables exist but access is denied, check RLS policies in Supabase dashboard');
  console.log('2. Ensure anon role has SELECT permission on news and jobs tables');
  console.log('3. Tables might need RLS policies like:');
  console.log('   CREATE POLICY "Enable read access for all users" ON news FOR SELECT USING (true);');
  console.log('   CREATE POLICY "Enable read access for all users" ON jobs FOR SELECT USING (true);');
}

checkNewsJobsRLS();
