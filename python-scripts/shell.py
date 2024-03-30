import sys
import io

# Set up the input and output streams
input_stream = io.TextIOWrapper(sys.stdin.buffer, encoding='utf-8')
output_stream = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8')

while True:
    try:
        # Read the Python code from the input stream
        code = input_stream.readline().strip()

        if not code:
            break

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