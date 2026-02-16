import { supabaseAdmin } from '../../lib/supabaseAdmin'

type AnyRequest = { method?: string; headers: Record<string,string|string[]|undefined>; url?: string }
type AnyResponse = { status?: (c:number)=>AnyResponse; json?: (b:unknown)=>void }

export default async function handler(req: AnyRequest, res: AnyResponse) {
  try {
    const host = req.headers.host || 'localhost'
    const forwardedProto = req.headers['x-forwarded-proto']
    const proto = Array.isArray(forwardedProto) ? forwardedProto[0] : forwardedProto || 'https'
    const url = new URL(`${proto}://${host}${req.url}`)
    const bucket = url.searchParams.get('bucket') || 'guide-images'
    const object = url.searchParams.get('object') || `uploads/${Date.now()}`
    const seconds = parseInt(url.searchParams.get('expires') || '300', 10)
    const { data, error } = await supabaseAdmin.storage.from(bucket).createSignedUploadUrl(object, { expiresIn: seconds })
    if (error) throw error
    res.status?.(200); res.json?.(data)
  } catch (e: unknown) {
    const message = e instanceof Error ? e.message : 'Server error'
    res.status?.(500); res.json?.({ error: message })
  }
}
