FROM node:20-slim

RUN apt-get update && apt-get install -y openscad

# Set the working directory in the container
WORKDIR /app

# Copy the package.json and package-lock.json files
COPY package*.json ./

# Install the dependencies
ENV PUPPETEER_SKIP_DOWNLOAD 1 
RUN npm install

# Copy the rest of the application code
COPY . .

# Expose the port that your backend runs on
EXPOSE 5000

# Start the backend application
CMD [ "node", "cluster.js" ]