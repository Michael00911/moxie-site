import { readFileSync, writeFileSync } from 'node:fs';
import http from 'node:http';

const BASE = 'http://localhost:3000';
const html = readFileSync('./tmp-index.html', 'utf8');

// Extract anchor hrefs
const anchorRe = /<a\b[^>]*\shref=["']([^"']+)["'][^>]*>/gi;
const scriptRe = /<script\b[^>]*\ssrc=["']([^"']+)["'][^>]*>/gi;
const linkRe = /<link\b[^>]*\shref=["']([^"']+)["'][^>]*>/gi;

function collect(re) {
  const out = new Set();
  let m;
  while ((m = re.exec(html))) out.add(m[1]);
  return [...out];
}

const anchors = collect(anchorRe);
const scripts = collect(scriptRe);
const links = collect(linkRe);

function isLocal(u) {
  if (u.startsWith('//')) return false;
  if (u.startsWith('http://localhost')) return true;
  if (/^https?:\/\//i.test(u)) return false;
  if (u.startsWith('mailto:') || u.startsWith('tel:')) return false;
  if (u.startsWith('#')) return false;
  if (u.startsWith('data:')) return false;
  return true;
}

function toUrl(u) {
  if (u.startsWith('http://localhost')) return u;
  if (u.startsWith('/')) return BASE + u;
  return BASE + '/' + u;
}

function head(url) {
  return new Promise((resolve) => {
    const req = http.request(url, { method: 'HEAD', timeout: 8000 }, (res) => {
      resolve({ url, status: res.statusCode });
      res.resume();
    });
    req.on('error', (e) => resolve({ url, status: 0, err: e.code || e.message }));
    req.on('timeout', () => { req.destroy(); resolve({ url, status: 0, err: 'TIMEOUT' }); });
    req.end();
  });
}

const anchorLocal = anchors.filter(isLocal).map(toUrl);
const scriptUrls = scripts.filter(isLocal).map(toUrl);
const linkUrls = links.filter(isLocal).map(toUrl);

console.log(`Anchors (local): ${anchorLocal.length}`);
console.log(`Scripts: ${scriptUrls.length}`);
console.log(`Links: ${linkUrls.length}`);

const all = [
  ...anchorLocal.map(u => ({ kind: 'anchor', url: u })),
  ...scriptUrls.map(u => ({ kind: 'script', url: u })),
  ...linkUrls.map(u => ({ kind: 'link', url: u })),
];

const results = [];
const CONCURRENCY = 12;
let i = 0;
async function worker() {
  while (i < all.length) {
    const cur = all[i++];
    const r = await head(cur.url);
    results.push({ kind: cur.kind, ...r });
  }
}
await Promise.all(Array.from({ length: CONCURRENCY }, worker));

const failures = results.filter(r => {
  if (r.kind === 'anchor') return r.status === 404 || r.status === 0 || r.status >= 500;
  return r.status !== 200;
});

console.log(`\nTotal checked: ${results.length}`);
console.log(`Failures: ${failures.length}`);

if (failures.length) {
  console.log('\n--- FAILURES ---');
  for (const f of failures) {
    console.log(`[${f.kind}] ${f.status || f.err}  ${f.url}`);
  }
}

const byStatus = {};
for (const r of results) {
  const k = `${r.kind}:${r.status || r.err}`;
  byStatus[k] = (byStatus[k] || 0) + 1;
}
console.log('\n--- STATUS SUMMARY ---');
for (const k of Object.keys(byStatus).sort()) console.log(`${k}  ${byStatus[k]}`);

writeFileSync('./tmp-audit-results.json', JSON.stringify({ results, failures }, null, 2));
