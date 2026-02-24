import { supabaseAdmin } from '../lib/supabaseAdmin.js';
import { createHash } from 'crypto';

type AnyRequest = {
  method?: string;
  headers: Record<string, string | undefined> & { host?: string; 'x-forwarded-proto'?: string };
  url?: string;
  body?: any;
  [key: string]: any;
};

type AnyResponse = {
  status?: (code: number) => AnyResponse;
  json?: (body: any) => void;
  setHeader?: (k: string, v: string) => void;
  end?: (body?: any) => void;
  [key: string]: any;
};

function parseJSONBody(req: AnyRequest): Promise<any> {
  return new Promise((resolve, reject) => {
    let data = '';
    req.on('data', (chunk: any) => (data += chunk));
    req.on('end', () => {
      try { resolve(data ? JSON.parse(data) : {}); } catch (e) { reject(e); }
    });
    req.on('error', reject);
  });
}

function extractSettled<T>(result: PromiseSettledResult<{ data: T[] | null; error: any }>): T[] {
  return result.status === 'fulfilled' && !result.value.error ? (result.value.data || []) : []
}

async function handleGet(req: AnyRequest, res: AnyResponse, id: string, isUuid: boolean): Promise<void> {
  const urlObj = new URL(`${req.headers['x-forwarded-proto'] || 'https'}://${req.headers.host || 'localhost'}${req.url || ''}`)
  const include = (urlObj.searchParams.get('include') || '').toLowerCase()
  const includeBody = include === 'body' || include === 'all' || include === '1'
  const gq = isUuid
    ? supabaseAdmin.from('guides').select('*').eq('id', id).maybeSingle()
    : supabaseAdmin.from('guides').select('*').eq('slug', id).maybeSingle()
  const { data: row, error } = await gq
  if (error) throw error
  if (!row) { res.status?.(404); res.json?.({ error: 'Not found' }); return }

  const guide = {
    id: row.id, slug: row.slug, title: row.title, summary: row.summary,
    heroImageUrl: row.hero_image_url ?? row.heroImageUrl,
    skillLevel: row.skill_level ?? row.skillLevel,
    estimatedTimeMin: row.estimated_time_min ?? row.estimatedTimeMin,
    lastUpdatedAt: row.last_updated_at ?? row.lastUpdatedAt,
    status: row.status,
    authorName: row.author_name ?? row.authorName,
    authorOrg: row.author_org ?? row.authorOrg,
    isEditorsPick: row.is_editors_pick ?? row.isEditorsPick,
    downloadCount: row.download_count ?? row.downloadCount,
    guideType: row.guide_type ?? row.guideType,
    domain: row.domain ?? null,
    functionArea: row.function_area ?? null,
    complexityLevel: row.complexity_level ?? null,
    documentUrl: row.document_url ?? row.documentUrl ?? null,
    body: includeBody ? (row.body ?? null) : null,
  } as any

  let steps: any[] = [], attachments: any[] = [], templates: any[] = []
  try {
    const [sr, ar, tr] = await Promise.allSettled([
      supabaseAdmin.from('guide_steps').select('id,position,title,body').eq('guide_id', guide.id).order('position', { ascending: true }),
      supabaseAdmin.from('guide_attachments').select('id,kind,title,url,size').eq('guide_id', guide.id),
      supabaseAdmin.from('guide_templates').select('id,title,url,size').eq('guide_id', guide.id),
    ])
    steps = extractSettled(sr)
    attachments = extractSettled(ar)
    templates = extractSettled(tr)
  } catch (err) {
    console.warn('api/guides/[id] warning: Error fetching sub-content:', err)
  }

  const out = {
    ...guide,
    steps: steps.map((s: any) => ({ id: s.id, position: s.position, title: s.title, content: s.body })),
    attachments: attachments.map((a: any) => ({ id: a.id, type: a.kind === 'file' ? 'file' : 'link', title: a.title, url: a.url, size: a.size })),
    templates: templates.map((t: any) => ({ id: t.id, title: t.title, url: t.url, size: t.size })),
  }
  const json = JSON.stringify(out)
  const etag = 'W/"' + createHash('sha1').update(json).digest('hex') + '"'
  res.setHeader?.('Cache-Control', 'public, max-age=60, stale-while-revalidate=300')
  res.setHeader?.('ETag', etag)
  if (req.headers['if-none-match'] === etag) { res.status?.(304); res.end?.(); return }
  res.status?.(200); res.end?.(json)
}

export default async function handler(req: AnyRequest, res: AnyResponse) {
  try {
    const proto = req.headers['x-forwarded-proto'] || 'https';
    const host = req.headers.host || 'localhost';
    const id = new URL(`${proto}://${host}${req.url || ''}`).pathname.split('/').pop() as string;
    const isUuid = /^[0-9a-z-]+$/i.test(id);

    if (req.method === 'GET') return await handleGet(req, res, id, isUuid)

    res.status?.(405); res.json?.({ error: 'Method not allowed' });
  } catch (err: any) {
    console.error('api/guides/[id] error:', err);
    res.status?.(500); res.json?.({ error: err?.message || 'Server error' });
  }
}
