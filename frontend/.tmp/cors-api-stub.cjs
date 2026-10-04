const http = require('node:http');
http.createServer((req, res) => {
  req.resume();
  res.setHeader('Content-Type', 'application/json');
  res.end(JSON.stringify({ success: true, data: { proxiedPath: req.url, method: req.method } }));
}).listen(3993, '0.0.0.0');
