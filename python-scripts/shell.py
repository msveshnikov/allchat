import sys
import io
import time

# Set up the input and output streams
input_stream = io.TextIOWrapper(sys.stdin.buffer, encoding='utf-8')
output_stream = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8')

def run_shell():
    while True:
        try:
            # Read the Python code from the input stream
            code = input_stream.readline().strip()

            if not code:
                continue  # Skip empty input

            # Execute the Python code
            try:
                output = exec(code)
                if output is not None:
                    output_stream.write(str(output) + '\n')
                output_stream.flush()
            except Exception as e:
                error_message = str(e)
                output_stream.write(f"Error: {error_message}\n")
                output_stream.flush()

        except KeyboardInterrupt:
            break

    # Close the input and output streams
    input_stream.close()
    output_stream.close()

if __name__ == "__main__":
    try:
        run_shell()
    except Exception as e:
        print(f"Error: {e}")
        sys.exit(1)

    while True:
        time.sleep(10)  # Keep the container running