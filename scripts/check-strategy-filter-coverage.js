/**
 * Script to check which strategy filter options have matching guides
 * This ensures each filter option has service cards related to it
 */

import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'

dotenv.config()

const supabaseUrl = process.env.VITE_SUPABASE_URL
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Missing Supabase credentials in .env file')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseKey)

// Strategy filter options
const STRATEGY_TYPES = [
  { id: 'journey', name: 'Journey' },
  { id: 'history', name: 'History' }
]

const STRATEGY_FRAMEWORKS = [
  { id: 'ghc', name: 'GHC' },
  { id: '6xd', name: '6xD (Digital Framework)' }
]

function matchesStrategyType(guide, typeId) {
  const subDomain = (guide.sub_domain || '').toLowerCase()
  const id = typeId.toLowerCase()
  return subDomain.includes(id) || subDomain === id
}

function matchesFramework(guide, frameworkId) {
  const allText = `${guide.sub_domain || ''} ${guide.domain || ''} ${guide.guide_type || ''}`.toLowerCase()
  if (frameworkId === '6xd') return allText.includes('6xd') || allText.includes('digital-framework') || allText.includes('digital framework')
  if (frameworkId === 'ghc') return allText.includes('ghc') || allText.includes('golden honeycomb')
  return false
}

function printMatchingSample(matching) {
  if (matching.length === 0) return
  const sample = matching.length <= 5 ? matching : matching.slice(0, 3)
  sample.forEach(g => console.log(`   - ${g.title} (${g.slug})`))
  if (matching.length > 5) console.log(`   ... and ${matching.length - 3} more`)
}

function printCoverageSection(label, items, guides, matchFn) {
  console.log(label)
  console.log('─'.repeat(50))
  for (const item of items) {
    const matching = (guides || []).filter(g => matchFn(g, item.id))
    const status = matching.length > 0 ? '✅' : '❌'
    console.log(`${status} ${item.name} (${item.id}): ${matching.length} guides`)
    printMatchingSample(matching)
  }
}

async function checkStrategyFilters() {
  console.log('🔍 Checking strategy filter coverage...\n')

  const { data: guides, error } = await supabase
    .from('guides')
    .select('id, title, slug, sub_domain, domain, guide_type')
    .or('domain.ilike.%Strategy%,guide_type.ilike.%Strategy%')
    .eq('status', 'Approved')

  if (error) { console.error('❌ Error fetching guides:', error); return }

  console.log(`📊 Total Strategy Guides: ${guides?.length || 0}\n`)

  printCoverageSection('📋 Strategy Type Filter Coverage:', STRATEGY_TYPES, guides, matchesStrategyType)
  console.log('\n')
  printCoverageSection('🔧 Framework/Program Filter Coverage:', STRATEGY_FRAMEWORKS, guides, matchesFramework)
  console.log('\n')

  // Summary
  console.log('📈 Summary:')
  console.log('─'.repeat(50))
  const typesWithCards = STRATEGY_TYPES.filter(t => (guides || []).some(g => matchesStrategyType(g, t.id)))
  const frameworksWithCards = STRATEGY_FRAMEWORKS.filter(f => (guides || []).some(g => matchesFramework(g, f.id)))
  console.log(`Strategy Types with cards: ${typesWithCards.length}/${STRATEGY_TYPES.length}`)
  console.log(`Frameworks with cards: ${frameworksWithCards.length}/${STRATEGY_FRAMEWORKS.length}`)

  // Recommendations
  console.log('\n💡 Recommendations:')
  console.log('─'.repeat(50))
  const typesWithoutCards = STRATEGY_TYPES.filter(t => !(guides || []).some(g => matchesStrategyType(g, t.id)))
  const frameworksWithoutCards = STRATEGY_FRAMEWORKS.filter(f => !(guides || []).some(g => matchesFramework(g, f.id)))

  if (typesWithoutCards.length > 0) {
    console.log(`⚠️  Remove Strategy Types without cards:`)
    typesWithoutCards.forEach(t => console.log(`   - ${t.name} (${t.id})`))
  }
  if (frameworksWithoutCards.length > 0) {
    console.log(`⚠️  Remove Frameworks without cards:`)
    frameworksWithoutCards.forEach(f => console.log(`   - ${f.name} (${f.id})`))
  }
  if (typesWithoutCards.length === 0 && frameworksWithoutCards.length === 0) {
    console.log('✅ All filter options have matching guides!')
  }
}

checkStrategyFilters().catch(console.error)

