import { supabaseAdmin } from '../../lib/supabaseAdmin'

type AnyRequest = { method?: string; headers: Record<string,string|undefined>; url?: string; [k:string]: any }
type AnyResponse = { status?: (c:number)=>AnyResponse; json?: (b:any)=>void }

export default async function handler(req: AnyRequest, res: AnyResponse) {
  try {
    const host = req.headers.host || 'localhost'
    const proto = (req.headers as any)['x-forwarded-proto'] || 'https'
    const url = new URL(`${proto}://${host}${req.url}`)
    const bucket = url.searchParams.get('bucket') || 'guide-images'
    const object = url.searchParams.get('object') || `uploads/${Date.now()}`
    // Note: createSignedUploadUrl doesn't accept expiresIn - URLs are valid for 2 hours by default
    // The expires query param is kept for API compatibility but not used
    const upsert = url.searchParams.get('upsert') === 'true'
    const { data, error } = await supabaseAdmin.storage.from(bucket).createSignedUploadUrl(object, { upsert })
    if (error) throw error
    res.status?.(200); res.json?.(data)
  } catch (e: any) {
    res.status?.(500); res.json?.({ error: e?.message || 'Server error' })
  }
}
