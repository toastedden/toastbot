from http.server import SimpleHTTPRequestHandler, HTTPServer
import os
import time
import logging
import sys
from base64 import b64encode, b64decode

# Ensure logs folder exists
log_dir = './web_server_logs'
os.makedirs(log_dir, exist_ok=True)

# Set up logging to rotate daily
def get_log_filename():
    timestamp = time.strftime("%Y-%m-%d")
    return os.path.join(log_dir, f"web_server_{timestamp}.log")

log_file = get_log_filename()

logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s [%(levelname)s] %(message)s",
    handlers=[
        logging.FileHandler(log_file),
        logging.StreamHandler(sys.stdout)
    ]
)

# Redirect stdout and stderr to log file
sys.stdout = open(log_file, "a")
sys.stderr = open(log_file, "a")

# Function to check and create a new log file every day
def rotate_log_file():
    global log_file
    new_log_file = get_log_filename()
    if log_file != new_log_file:
        log_file = new_log_file
        logging.handlers[0].close()
        logging.handlers[0] = logging.FileHandler(log_file)

# Create new log file every day at midnight
def daily_log_rotation():
    while True:
        time.sleep(60)
        rotate_log_file()

# Start log rotation in a separate thread
import threading
log_thread = threading.Thread(target=daily_log_rotation, daemon=True)
log_thread.start()

# Define username and password for Basic Auth
USERNAME = os.getenv("HTTP_USERNAME", "admin")
PASSWORD = os.getenv("HTTP_PASSWORD", "password")

# Encode the username and password in Base64 for Basic Auth comparison
AUTH_STRING = b64encode(f"{USERNAME}:{PASSWORD}".encode()).decode()

class CustomHandler(SimpleHTTPRequestHandler):
    """
    Custom HTTP handler to provide basic authentication
    and serve directory listings or files.
    """

    def do_GET(self):
        """
        Handle GET requests with Basic Auth and directory/file serving logic.
        """
        # Log the incoming request
        logging.info(f"Incoming connection from {self.client_address[0]}, requested: {self.path}")

        # Check for Authorization header
        auth_header = self.headers.get('Authorization')

        if auth_header:
            if auth_header == f"Basic {AUTH_STRING}":
                # Log successful authentication
                logging.info(f"Authentication success from {self.client_address[0]}")
                # Authorization successful
                requested_path = self.path.lstrip('/')
                full_path = os.path.join("./logs", requested_path)

                if os.path.isdir(full_path):
                    # Serve directory listing for directories
                    self.list_directory(full_path)
                elif os.path.isfile(full_path):
                    # Serve file for download
                    self.send_response(200)
                    self.send_header('Content-type', 'application/octet-stream')
                    self.send_header('Content-Disposition', f'attachment; filename="{os.path.basename(full_path)}"')
                    self.end_headers()
                    with open(full_path, 'rb') as f:
                        self.wfile.write(f.read())
                else:
                    # If path doesn't exist, return to root directory
                    self.list_directory("./logs")
            else:
                # Log failed authentication
                logging.warning(f"Authentication failed from {self.client_address[0]}")
                self.send_response(401)
                self.send_header('WWW-Authenticate', 'Basic realm="Access to logs"')
                self.send_header('Content-type', 'text/html')
                self.end_headers()
                self.wfile.write(b"Unauthorized access. Please provide valid credentials.")
        else:
            # Log missing authentication
            logging.warning(f"Missing Authorization header from {self.client_address[0]}")
            self.send_response(401)
            self.send_header('WWW-Authenticate', 'Basic realm="Access to logs"')
            self.send_header('Content-type', 'text/html')
            self.end_headers()
            self.wfile.write(b"Unauthorized access. Please provide valid credentials.")
       
    def list_directory(self, path):
        """
        Serve an HTML directory listing for a given path.
        """
        try:
            # Get the list of files and directories
            file_list = os.listdir(path)
        except OSError:
            # Respond with 404 if the directory cannot be accessed
            self.send_error(404, "No permission to list directory")
            return None

        # Sort the file list for display
        file_list.sort(key=lambda a: a.lower())

        # HTML response template
        response = r"""
        <html>
            <head>
                <title>Directory Listing</title>
                <style>
                    /* Basic styling for the directory listing page */
                    * { margin: 0; padding: 0; box-sizing: border-box; }
                    html,
                    body {
                        font-family: Arial, sans-serif;
                        background-color: #09090a;
                        color: #f9d290;
                        min-height: 100vh;
                        width: 100%;
                        margin: 0;
                        padding: 20px 20px 0 20px;
                        position: relative;
                        display: flex;
                        flex-direction: column;
                    }
                    h2 { color: #a58b60; margin-bottom: 20px; font-size: 24px; }
                    ul { list-style-type: none; padding: 0; margin: 20px 0; }
                    li {
                        margin: 12px 0; padding: 8px;
                        border-radius: 4px; transition: background-color 0.2s;
                    }
                    li:hover { background-color: #161618; }
                    a {
                        color: #f9d290; text-decoration: none; display: inline-block;
                    }
                    a:hover { text-decoration: underline; }
                    .file-meta { color: #e6e6e6; }
                    hr { border: 0; height: 1px; background-color: #a58b60; margin: 20px 0; opacity: 0.5; }
                    .home-button {
                        position: absolute; top: 20px; right: 20px;
                        background-color: #161618; color: #a58b60;
                        border: none; padding: 10px 20px;
                        font-size: 14px; cursor: pointer;
                        border-radius: 4px; text-align: center;
                        text-decoration: none;
                    }
                    .home-button:hover {
                        background-color: #363431; color: #f9d290;
                    }
                    .content {
                        flex: 1 0 auto;
                        margin-bottom: 20px;
                    }
                    footer {
                        margin-top: auto;
                        text-align: center;
                        padding: 0px 0 0 0;
                        width: 100%;
                        color: #a58b60;
                        font-size: 12px;
                        flex-shrink: 0;
                    }

                    footer a {
                        color: #a58b60;
                    }

                    footer a:hover {
                        color: #f9d290;
                    }
                </style>
            </head>
            <body>
                <div class="content">
                    <a href="/" class="home-button">Home</a>
                    <h2>Directory Listing for ToastBot's logs</h2>
                    <hr>
                    <ul>
        """

        # Append each file or directory to the response
        for name in file_list:
            fullname = os.path.join(path, name)
            display_name = link_name = name

            # Add a trailing slash for directories
            if os.path.isdir(fullname):
                display_name += "/"
                link_name += "/"

            # Format file size
            file_size = os.path.getsize(fullname)
            if file_size < 1024:
                size_str = f"{file_size} bytes"
            elif file_size < 1024 ** 2:
                size_str = f"{file_size / 1024:.2f} KB"
            elif file_size < 1024 ** 3:
                size_str = f"{file_size / (1024 ** 2):.2f} MB"
            else:
                size_str = f"{file_size / (1024 ** 3):.2f} GB"

            # Format modification time
            mod_time = os.path.getmtime(fullname)
            mod_time_str = time.strftime("%Y-%m-%d %H:%M:%S", time.localtime(mod_time))

            # Add file details to the response
            response += f'<li><a href="{link_name}">{display_name}</a><span class="file-meta"> - {size_str}, modified on {mod_time_str}</span></li>'

        # Close the HTML response
        response += """
                    </ul>   
                    <hr>
                    <footer>
                        <p>Web Server Version 1.0.0 - <a href="https://github.com/toastedden/toastbot" target="_blank" title="Source">Source</a></p>
                    </footer>
                </div>
            </body>
        </html>
        """

        # Send the HTML response
        encoded = response.encode("utf-8", "surrogateescape")
        self.send_response(200)
        self.send_header("Content-type", "text/html; charset=utf-8")
        self.send_header("Content-Length", str(len(encoded)))
        self.end_headers()
        self.wfile.write(encoded)

        return None

if __name__ == "__main__":
    # Define the server address and port
    server_address = ('', 9000)
    httpd = HTTPServer(server_address, CustomHandler)

    # Start the HTTP server
    print("Serving on port 9000")
    httpd.serve_forever()
