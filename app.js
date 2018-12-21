const express = require('express');
const http = require('http');
const https = require('https');
const redirect = require('express-naked-redirect');
const config = require('./config');
const routes = require('./routes');
const socket = require('./socket');

const app = express();


app.use(redirect(true));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(routes);

/* eslint no-console: 0 */
if (process.env.DEV) {
  const server = http.createServer(app);
  socket(server);
  server.listen(process.env.HTTPPORT || 80, () => {
    console.log(`Running on Development Mode\nListening on port ${process.env.HTTPPORT || 80}`);
  });
} else {
  const server = https.createServer(config.ssl, app);
  socket(server);
  server.listen(process.env.HTTPSPORT || 443, () => {
    console.log(`Running on Production Mode\nListening on port ${process.env.HTTPSPORT || 443}`);
  });

  http.createServer((req, res) => {
    res.writeHead(301, { Location: `https://${req.headers.host}${req.url}` });
    res.end();
  }).listen(process.env.HTTPPORT || 80);
}
