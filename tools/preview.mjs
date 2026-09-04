// Local visual review only. Uses Node built-ins; no product dependencies.
import http from 'node:http';
import { readFile, stat } from 'node:fs/promises';
import { resolve, extname, sep } from 'node:path';
const root = resolve('protea_vivo');
const args = process.argv.slice(2);
const port = Number(args[args.indexOf('--port') + 1] || 4173);
const types = { '.html':'text/html; charset=utf-8', '.css':'text/css; charset=utf-8', '.js':'text/javascript; charset=utf-8', '.png':'image/png', '.jpg':'image/jpeg', '.jpeg':'image/jpeg', '.webp':'image/webp', '.svg':'image/svg+xml' };
http.createServer(async (req,res) => {
  try {
    let path = resolve(root, '.' + decodeURIComponent(new URL(req.url, 'http://localhost').pathname));
    if (path !== root && !path.startsWith(root + sep)) { res.writeHead(403); res.end(); return; }
    if ((await stat(path)).isDirectory()) path = resolve(path,'index.html');
    res.writeHead(200, { 'Content-Type':types[extname(path)] || 'application/octet-stream', 'Cache-Control':'no-store' });
    res.end(await readFile(path));
  } catch { res.writeHead(404); res.end('Not found'); }
}).listen(port,'0.0.0.0',()=>console.log(`Protea review listening on ${port}`));
