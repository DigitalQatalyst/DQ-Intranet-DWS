-- Update community images
-- Replace the URLs below with your actual image URLs
-- You can use:
--   - Local paths: '/images/communities/agile.jpg'
--   - Hosted URLs: 'https://your-domain.com/images/agile.jpg'
--   - Unsplash URLs: 'https://images.unsplash.com/photo-...'

-- Update Agile community image
UPDATE communities 
SET imageurl = 'https://image2url.com/r2/bucket3/images/1767946009087-adb42d9f-2c19-49d3-b16a-39a0476cb329.png'
WHERE LOWER(name) LIKE '%agile%';

-- Update Culture community image
UPDATE communities 
SET imageurl = 'https://image2url.com/r2/bucket3/images/1767946257017-fc8ba41d-6c11-4556-a7d4-1beb5c009b33.png'
WHERE LOWER(name) LIKE '%culture%';

-- Update Persona community image (GHC - Persona)
UPDATE communities 
SET imageurl = 'https://image2url.com/r2/bucket2/images/1767946326338-9a60380e-ed9b-48e1-8f28-e28626bf19bd.blob'
WHERE LOWER(name) LIKE '%persona%';

-- Update DTMF community image
UPDATE communities 
SET imageurl = 'https://image2url.com/r2/bucket2/images/1767946372759-333d765b-143b-4df7-ae06-109498ef312a.blob'
WHERE LOWER(name) LIKE '%dtmf%';

-- Update Tech community image
UPDATE communities 
SET imageurl = 'https://images.unsplash.com/photo-1518770660439-4636190af475?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'
WHERE LOWER(name) LIKE '%tech%';

-- Update Vision community image
UPDATE communities 
SET imageurl = 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'
WHERE LOWER(name) LIKE '%vision%';

-- Verify the updates
SELECT 
    name,
    imageurl,
    CASE 
        WHEN imageurl IS NULL THEN '⚠️ No image set'
        WHEN imageurl = '' THEN '⚠️ Empty image URL'
        ELSE '✅ Image set'
    END as status
FROM communities
ORDER BY name;
