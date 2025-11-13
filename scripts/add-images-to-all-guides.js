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

// Image URLs by category and type
const IMAGE_MAP = {
  strategy: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&h=400&fit=crop&q=80', // Strategy/business
  guidelines: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=800&h=400&fit=crop&q=80', // Guidelines/documentation
  blueprints: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&h=400&fit=crop&q=80', // Blueprints/architecture
  testimonial: 'https://images.unsplash.com/photo-1521791136064-7986c2920216?w=800&h=400&fit=crop&q=80', // Testimonials/success
};

// Specific images for certain keywords
const KEYWORD_IMAGES = {
  'security': 'https://images.unsplash.com/photo-1563013544-824ae1b704d3?w=800&h=400&fit=crop&q=80',
  'risk': 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=800&h=400&fit=crop&q=80',
  'deployment': 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=800&h=400&fit=crop&q=80',
  'design': 'https://images.unsplash.com/photo-1561070791-2526d30994b5?w=800&h=400&fit=crop&q=80',
  'development': 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=800&h=400&fit=crop&q=80',
  'transformation': 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=800&h=400&fit=crop&q=80',
  'journey': 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=800&h=400&fit=crop&q=80',
  'social media': 'https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=800&h=400&fit=crop&q=80',
  'scrum': 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=800&h=400&fit=crop&q=80',
  'agile': 'https://images.unsplash.com/photo-1552581234-26160f608093?w=800&h=400&fit=crop&q=80',
  'meeting': 'https://images.unsplash.com/photo-1556761175-5973dc0f32e7?w=800&h=400&fit=crop&q=80',
  'client': 'https://images.unsplash.com/photo-1556761175-4b46a572b786?w=800&h=400&fit=crop&q=80',
  'success': 'https://images.unsplash.com/photo-1521791136064-7986c2920216?w=800&h=400&fit=crop&q=80',
  'e-commerce': 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=800&h=400&fit=crop&q=80',
  'deployment': 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=800&h=400&fit=crop&q=80',
};

function getImageForGuide(guide) {
  const title = (guide.title || '').toLowerCase();
  const domain = (guide.domain || '').toLowerCase();
  const guideType = (guide.guide_type || '').toLowerCase();
  
  // Check for keyword matches first
  for (const [keyword, imageUrl] of Object.entries(KEYWORD_IMAGES)) {
    if (title.includes(keyword) || domain.includes(keyword) || guideType.includes(keyword)) {
      return imageUrl;
    }
  }
  
  // Then check by domain/category
  if (domain.includes('strategy') || guideType.includes('strategy')) {
    return IMAGE_MAP.strategy;
  } else if (domain.includes('blueprint') || guideType.includes('blueprint')) {
    return IMAGE_MAP.blueprints;
  } else if (domain.includes('testimonial') || guideType.includes('testimonial')) {
    return IMAGE_MAP.testimonial;
  } else {
    return IMAGE_MAP.guidelines;
  }
}

async function addImagesToAllGuides() {
  console.log('🖼️  Adding images to all guides...\n');

  let retries = 3;
  let guides = null;
  let error = null;

  // Retry logic for fetching
  while (retries > 0) {
    try {
      const result = await supabase
        .from('guides')
        .select('id, title, hero_image_url, domain, guide_type')
        .eq('status', 'Approved');
      
      guides = result.data;
      error = result.error;
      break;
    } catch (err) {
      retries--;
      if (retries > 0) {
        console.log(`⚠️  Network error, retrying... (${retries} attempts left)`);
        await new Promise(resolve => setTimeout(resolve, 2000));
      } else {
        console.error('❌ Error fetching guides after retries:', err);
        return;
      }
    }
  }

  if (error) {
    console.error('❌ Error fetching guides:', error);
    return;
  }

  if (!guides || guides.length === 0) {
    console.log('❌ No guides found');
    return;
  }

  console.log(`📊 Found ${guides.length} approved guides\n`);

  let updated = 0;
  let skipped = 0;
  let failed = 0;

  // Process in batches to avoid overwhelming the API
  const batchSize = 10;
  for (let i = 0; i < guides.length; i += batchSize) {
    const batch = guides.slice(i, i + batchSize);
    console.log(`\n📦 Processing batch ${Math.floor(i / batchSize) + 1} (${batch.length} guides)...`);

    for (const guide of batch) {
      const imageUrl = guide.hero_image_url;
      const hasImage = imageUrl && imageUrl.trim() !== '' && !imageUrl.includes('/image.png');
      
      if (!hasImage) {
        const newImageUrl = getImageForGuide(guide);
        
        try {
          const { error: updateError } = await supabase
            .from('guides')
            .update({
              hero_image_url: newImageUrl,
              last_updated_at: new Date().toISOString()
            })
            .eq('id', guide.id);

          if (updateError) {
            console.error(`   ❌ ${guide.title}: ${updateError.message}`);
            failed++;
          } else {
            console.log(`   ✅ ${guide.title}`);
            updated++;
          }
        } catch (err) {
          console.error(`   ❌ ${guide.title}: ${err.message}`);
          failed++;
        }
      } else {
        skipped++;
      }
    }

    // Small delay between batches
    if (i + batchSize < guides.length) {
      await new Promise(resolve => setTimeout(resolve, 500));
    }
  }

  console.log(`\n✅ Complete!`);
  console.log(`   Updated: ${updated} guides`);
  console.log(`   Skipped: ${skipped} guides (already have images)`);
  console.log(`   Failed: ${failed} guides`);
}

addImagesToAllGuides().catch(console.error);

