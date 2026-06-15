const https = require('https');
const http = require('http');

module.exports = async (req, res) => {
  const target = 'http://143.198.88.152:10007';
  const url = target + req.url;

  const client = url.startsWith('https') ? https : http;

  const proxy = client.request(url, {
    method: req.method,
    headers: req.headers
  }, (proxyRes) => {
    res.writeHead(proxyRes.statusCode, proxyRes.headers);
    proxyRes.pipe(res, { end: true });
  });

  req.pipe(proxy, { end: true });

  proxy.on('error', (err) => {
    res.status(500).send('Proxy Error: ' + err.message);
  });
};
