import { supabaseAdmin } from '../../lib/supabaseAdmin'

type AnyRequest = { method?: string; headers: Record<string,string|string[]|undefined>; url?: string; on: (event: 'data' | 'end' | 'error', listener: (chunk?: unknown) => void) => void }
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
    if (req.method === 'POST') {
      const body = await parseJSONBody(req)
      const { data, error } = await supabaseAdmin.from('guides').insert(body).select('id').single()
      if (error) throw error
      res.status?.(201); res.json?.({ id: data.id }); return
    }
    res.status?.(405); res.json?.({ error: 'Method not allowed' });
  } catch (e: unknown) {
    const message = e instanceof Error ? e.message : 'Server error'
    res.status?.(500); res.json?.({ error: message })
  }
}
