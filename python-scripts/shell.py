import io
import http.server
import contextlib
import os
import base64
import json
import signal

class PythonExecutionServer(http.server.BaseHTTPRequestHandler):
    def do_POST(self):
        content_length = int(self.headers.get('Content-Length', 0))
        code_input = self.rfile.read(content_length).decode('utf-8')
        output_stream = io.StringIO()
        initial_files = set(os.listdir(os.getcwd()))  # Get the initial set of files

        with contextlib.redirect_stdout(output_stream), contextlib.redirect_stderr(output_stream):
            try:
                def execute_with_timeout():
                    compiled_code = compile(code_input, "<input>", "exec")
                    exec(compiled_code, globals())
                signal.alarm(180)
                execute_with_timeout()
                signal.alarm(0)

                output = output_stream.getvalue()
                final_files = set(os.listdir(os.getcwd()))  # Get the final set of files
                new_files = [str(file) for file in final_files - initial_files]  # Get the new files

                # Prepare the JSON response
                response_data = {
                    "output": output,
                    "new_files": {}
                }

                # Read the content of each new file and encode it in base64
                for file_path in new_files:
                    with open(file_path, "rb") as f:
                        file_content = f.read()
                        base64_content = base64.b64encode(file_content).decode('utf-8')
                        response_data["new_files"][file_path] = base64_content

                json_response = json.dumps(response_data)

                self.send_response(200)
                self.send_header("Content-Type", "application/json")
                self.end_headers()
                self.wfile.write(json_response.encode('utf-8'))

            except Exception as e:
                error_message = str(e)
                self.send_response(500)
                self.end_headers()
                self.wfile.write(error_message.encode('utf-8'))

def run_server(server_class=http.server.HTTPServer, handler_class=PythonExecutionServer, port=8000):
    server_address = ('', port)
    httpd = server_class(server_address, handler_class)
    print(f'Starting Python execution server on port {port}')
    httpd.serve_forever()

if __name__ == "__main__":
    server_port = int(os.environ.get('PYTHON_SERVER_PORT', 8000))
    run_server(port=server_port)