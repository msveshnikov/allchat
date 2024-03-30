import http.server
import os
import contextlib
import io

class PythonExecutionServer(http.server.BaseHTTPRequestHandler):
    def do_POST(self):
        content_length = int(self.headers.get('Content-Length', 0))
        code_input = self.rfile.read(content_length).decode('utf-8')

        # Capture the standard output and error streams
        output_stream = io.StringIO()
        with contextlib.redirect_stdout(output_stream), contextlib.redirect_stderr(output_stream):
            try:
                # Execute the code and capture the output
                compiled_code = compile(code_input, "<input>", "exec")
                exec(compiled_code, globals())
                output = output_stream.getvalue()

                self.send_response(200)
                self.end_headers()
                self.wfile.write(output.encode('utf-8'))
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