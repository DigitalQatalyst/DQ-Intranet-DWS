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

async function checkAllGuides() {
  console.log('🔍 Checking all guides for images...\n');

  // Fetch all approved guides
  const { data: guides, error } = await supabase
    .from('guides')
    .select('id, title, hero_image_url, domain, guide_type')
    .eq('status', 'Approved');

  if (error) {
    console.error('❌ Error fetching guides:', error);
    return;
  }

  // Categorize guides
  const strategy = [];
  const guidelines = [];
  const blueprints = [];
  const testimonials = [];

  (guides || []).forEach(g => {
    const domain = (g.domain || '').toLowerCase();
    const guideType = (g.guide_type || '').toLowerCase();
    const title = (g.title || '').toLowerCase();

    if (domain.includes('strategy') || guideType.includes('strategy') || title.includes('strategy')) {
      strategy.push(g);
    } else if (domain.includes('blueprint') || guideType.includes('blueprint') || title.includes('blueprint')) {
      blueprints.push(g);
    } else if (domain.includes('testimonial') || guideType.includes('testimonial') || title.includes('testimonial')) {
      testimonials.push(g);
    } else {
      guidelines.push(g);
    }
  });

  function checkCategory(name, categoryGuides) {
    console.log(`\n📋 ${name.toUpperCase()} (${categoryGuides.length} guides):`);
    let withImages = 0;
    let withoutImages = 0;

    categoryGuides.forEach(g => {
      const imageUrl = g.hero_image_url;
      const hasImage = imageUrl && imageUrl.trim() !== '' && !imageUrl.includes('/image.png');
      
      if (hasImage) {
        withImages++;
      } else {
        console.log(`   ❌ ${g.title} - No image`);
        withoutImages++;
      }
    });

    console.log(`   ✅ With images: ${withImages}`);
    console.log(`   ❌ Without images: ${withoutImages}`);
    
    return { withImages, withoutImages };
  }

  const strategyStats = checkCategory('Strategy', strategy);
  const guidelinesStats = checkCategory('Guidelines', guidelines);
  const blueprintsStats = checkCategory('Blueprints', blueprints);
  const testimonialsStats = checkCategory('Testimonials', testimonials);

  console.log(`\n📊 OVERALL SUMMARY:`);
  console.log(`   Strategy: ${strategyStats.withImages}/${strategy.length} with images`);
  console.log(`   Guidelines: ${guidelinesStats.withImages}/${guidelines.length} with images`);
  console.log(`   Blueprints: ${blueprintsStats.withImages}/${blueprints.length} with images`);
  console.log(`   Testimonials: ${testimonialsStats.withImages}/${testimonials.length} with images`);
  
  const totalWithImages = strategyStats.withImages + guidelinesStats.withImages + blueprintsStats.withImages + testimonialsStats.withImages;
  const totalGuides = guides.length;
  
  console.log(`\n   Total: ${totalWithImages}/${totalGuides} guides have images`);
  
  if (totalWithImages < totalGuides) {
    console.log(`\n⚠️  ${totalGuides - totalWithImages} guides still need images`);
  } else {
    console.log(`\n✅ All guides have images!`);
  }
}

checkAllGuides().catch(console.error);

