// api/ping.js  ->  /api/ping
export default function handler(req, res) {
  res.status(200).send('pong');
}
