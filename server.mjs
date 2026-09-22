import http from 'node:http';
import { readFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const root = fileURLToPath(new URL('./dist/', import.meta.url));
const port = Number(process.env.PORT || 5180);
const types = { '.mp4': 'video/mp4', '.html': 'text/html; charset=utf-8', '.css': 'text/css; charset=utf-8', '.js': 'text/javascript; charset=utf-8', '.svg': 'image/svg+xml', '.jpg': 'image/jpeg', '.png': 'image/png', '.webp': 'image/webp', '.ico': 'image/x-icon' };
const server = http.createServer(async (req, res) => {
  if (req.method !== 'GET' && req.method !== 'HEAD') {
    res.writeHead(405, { Allow: 'GET, HEAD' }).end();
    return;
  }
  try {
    const pathname = decodeURIComponent(new URL(req.url, 'http://localhost').pathname);
    const file = path.resolve(root, '.' + (pathname === '/' ? '/index.html' : pathname));
    const relative = path.relative(root, file);
    if (relative.startsWith('..') || path.isAbsolute(relative)) {
      res.writeHead(403).end('Erisim reddedildi');
      return;
    }
    const content = await readFile(file);
    const headers = { 'Content-Type': types[path.extname(file)] || 'application/octet-stream', 'Cache-Control': 'no-store', 'Accept-Ranges': 'bytes', 'Content-Length': content.length };
    if (req.headers.range) {
      const match = /^bytes=(\d*)-(\d*)$/.exec(req.headers.range);
      const start = match ? (match[1] ? Number(match[1]) : Math.max(0, content.length - Number(match[2]))) : NaN;
      const end = match ? (match[1] && match[2] ? Math.min(Number(match[2]), content.length - 1) : content.length - 1) : NaN;
      if (!match || (!match[1] && !match[2]) || start > end || start >= content.length || !Number.isSafeInteger(start) || !Number.isSafeInteger(end)) {
        res.writeHead(416, { 'Content-Range': 'bytes */' + content.length }).end(); return;
      }
      res.writeHead(206, { ...headers, 'Content-Range': 'bytes ' + start + '-' + end + '/' + content.length, 'Content-Length': end - start + 1 });
      res.end(req.method === 'HEAD' ? undefined : content.subarray(start, end + 1)); return;
    }
    res.writeHead(200, headers);
    res.end(req.method === 'HEAD' ? undefined : content);
  } catch (error) {
    res.writeHead(error.code === 'ENOENT' || error.code === 'EISDIR' ? 404 : 400).end('Dosya bulunamadi');
  }
});
server.on('error', error => {
  console.error(error.code === 'EADDRINUSE' ? `${port} portu kullanimda. Onceki Sofra sunucusunu Ctrl+C ile kapatip tekrar deneyin.` : error.message);
  process.exitCode = 1;
});
server.listen(port, '127.0.0.1', () => console.log(`Sofra Ocakbasi hazir: http://127.0.0.1:${server.address().port}/`));
