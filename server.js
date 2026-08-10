// Custom entry point for Hostinger's Node.js hosting (Passenger-style app manager),
// which launches this file directly and assigns the port via process.env.PORT.
// Not used by `npm run dev`/`next start` locally or by Vercel — those keep using
// Next's own server. This file only matters for the Hostinger deployment target.
const { createServer } = require("http");
const next = require("next");

const port = process.env.PORT || 3000;
const app = next({ dev: false });
const handle = app.getRequestHandler();

app.prepare().then(() => {
  createServer((req, res) => handle(req, res)).listen(port, () => {
    console.log(`Safar Traders server ready on port ${port}`);
  });
});
