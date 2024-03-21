# Use the official Node.js image as the base image
FROM node:20-slim

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