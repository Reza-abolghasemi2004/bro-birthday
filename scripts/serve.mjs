import { createServer } from 'node:http';
import { readFile, stat } from 'node:fs/promises';
import { resolve, extname, sep } from 'node:path';

const root = resolve(import.meta.dirname, '..');
const types = { '.html': 'text/html; charset=utf-8', '.css': 'text/css; charset=utf-8', '.js': 'text/javascript; charset=utf-8', '.woff2': 'font/woff2', '.svg': 'image/svg+xml', '.json': 'application/json' };
const port = Number(process.env.PORT || 3000);
createServer(async (req, res) => {
  try {
    const url = new URL(req.url, 'http://localhost');
    const pathname = decodeURIComponent(url.pathname);
    if (pathname.split('/').some(part => part.startsWith('.')) || pathname.startsWith('/node_modules/')) throw new Error('Forbidden');
    let file = resolve(root, '.' + pathname);
    if (file !== root && !file.startsWith(root + sep)) throw new Error('Forbidden');
    if ((await stat(file)).isDirectory()) file = resolve(file, 'index.html');
    res.writeHead(200, { 'Content-Type': types[extname(file)] || 'application/octet-stream', 'Cache-Control': 'no-cache' });
    res.end(await readFile(file));
  } catch {
    res.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' });
    res.end('Not found');
  }
}).listen(port, '0.0.0.0', () => console.log(`BROTHER 29 — http://0.0.0.0:${port}`));
