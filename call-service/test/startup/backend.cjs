const http = require('node:http');
http.createServer((req,res) => {
  if (req.url === '/api/health') { res.writeHead(200); return res.end('ok'); }
  if (req.url === '/api/calls/internal/recover' && req.headers['x-call-internal-token'] === process.env.CALL_INTERNAL_TOKEN) { res.writeHead(204); return res.end(); }
  res.writeHead(403); res.end();
}).listen(3993, '0.0.0.0');
