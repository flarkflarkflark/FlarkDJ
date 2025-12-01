#!/usr/bin/env python3
"""
Simple HTTP server for FlarkDJ Pedalboard development
"""

import http.server
import socketserver
import os
import sys

PORT = 8000

class MyHTTPRequestHandler(http.server.SimpleHTTPRequestHandler):
    def end_headers(self):
        # Add CORS headers for local development
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
        self.send_header('Access-Control-Allow-Headers', '*')
        super().end_headers()

    def do_OPTIONS(self):
        self.send_response(200)
        self.end_headers()

def main():
    # Change to web-app directory
    web_app_dir = os.path.dirname(os.path.abspath(__file__))
    os.chdir(web_app_dir)

    Handler = MyHTTPRequestHandler

    print("=" * 60)
    print("🎛️  FlarkDJ Pedalboard Server")
    print("=" * 60)
    print(f"\n📂 Serving directory: {web_app_dir}")
    print(f"🌐 Server running at: http://localhost:{PORT}")
    print("\n✨ Open your browser and navigate to the URL above")
    print("⚠️  Press Ctrl+C to stop the server\n")

    with socketserver.TCPServer(("", PORT), Handler) as httpd:
        try:
            httpd.serve_forever()
        except KeyboardInterrupt:
            print("\n\n👋 Server stopped. Goodbye!")
            sys.exit(0)

if __name__ == "__main__":
    main()
