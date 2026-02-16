import { supabaseAdmin } from '../../lib/supabaseAdmin'

type AnyRequest = {
  method?: string;
  headers: Record<string, string | string[] | undefined>;
  url?: string;
  on: (event: 'data' | 'end' | 'error', listener: (chunk?: unknown) => void) => void;
}
type AnyResponse = { status?: (c:number)=>AnyResponse; json?: (b:unknown)=>void }

function parseJSONBody(req: AnyRequest): Promise<unknown> {
  return new Promise((resolve, reject) => {
    let data = ''
    req.on('data', (c) => (data += String(c ?? '')))
    req.on('end', () => { try { resolve(data ? JSON.parse(data) : {}) } catch (e) { reject(e) } })
    req.on('error', reject)
  })
}

export default async function handler(req: AnyRequest, res: AnyResponse) {
  try {
    const host = req.headers.host || 'localhost'
    const forwardedProto = req.headers['x-forwarded-proto']
    const proto = Array.isArray(forwardedProto) ? forwardedProto[0] : forwardedProto || 'https'
    const url = new URL(`${proto}://${host}${req.url}`)
    const id = url.pathname.split('/').pop() as string

    if (req.method === 'PUT') {
      const body = await parseJSONBody(req)
      const { error } = await supabaseAdmin.from('guides').update(body).eq('id', id)
      if (error) throw error
      await supabaseAdmin.from('guides_versions').insert({ guide_id: id, version: 'auto', changed_at: new Date().toISOString(), diff_summary: body._diff || 'update' })
      res.status?.(200); res.json?.({ ok: true }); return
    }
    if (req.method === 'DELETE') {
      const { error } = await supabaseAdmin.from('guides').delete().eq('id', id)
      if (error) throw error
      res.status?.(200); res.json?.({ ok: true }); return
    }
    res.status?.(405); res.json?.({ error: 'Method not allowed' })
  } catch (e: unknown) {
    const message = e instanceof Error ? e.message : 'Server error'
    res.status?.(500); res.json?.({ error: message })
  }
}
