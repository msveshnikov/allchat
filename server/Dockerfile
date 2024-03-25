FROM node:20.9.0-bullseye

RUN sed -i'.bak' 's/$/ contrib/' /etc/apt/sources.list
RUN apt-get update && apt-get install firefox -y


# Set the working directory in the container
WORKDIR /app

# Copy the package.json and package-lock.json files
COPY package*.json ./

# Install the dependencies
RUN npm install

# Copy the rest of the application code
COPY . .

# Expose the port that your backend runs on
EXPOSE 5000

# Start the backend application
CMD [ "node", "index.js" ]