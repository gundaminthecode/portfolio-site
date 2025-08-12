# portfolio-site/api/log.py    ->  GET /api/log
from http.server import BaseHTTPRequestHandler
class handler(BaseHTTPRequestHandler):
    def do_GET(self):
        print("log.py ran")
        self.send_response(204)
        self.end_headers()
