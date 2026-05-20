/// <reference types="node" />
import { readFileSync } from 'node:fs'
import { request as httpsRequest } from 'node:https'
import { IncomingMessage } from 'node:http'

export function loadEnv(file: string) {
  try {
    const lines = readFileSync(file, 'utf-8').split('\n')
    for (const line of lines) {
      const m = line.match(/^([A-Z_][A-Z0-9_]*)=(.*)$/i)
      if (m && !process.env[m[1]]) process.env[m[1]] = m[2].replace(/^["']|["']$/g, '').trim()
    }
  } catch { /* 从 shell 环境读取 */ }
}

export function httpFetch(rawUrl: string, opts: {
  method?: string; headers?: Record<string, string>; body?: string; timeoutMs?: number
}): Promise<{ status: number; body: string }> {
  return new Promise((resolve, reject) => {
    const url = new URL(rawUrl)
    const req = httpsRequest({
      hostname: url.hostname, port: url.port || 443,
      path: url.pathname + url.search,
      method: opts.method ?? 'GET', headers: opts.headers ?? {},
    }, (res: IncomingMessage) => {
      let body = ''
      res.on('data', (c: Buffer) => { body += c.toString() })
      res.on('end', () => resolve({ status: res.statusCode ?? 0, body }))
      res.on('error', reject)
    })
    req.on('error', reject)
    if (opts.timeoutMs) req.setTimeout(opts.timeoutMs, () => { req.destroy(); reject(new Error('timeout')) })
    if (opts.body) req.write(opts.body)
    req.end()
  })
}
