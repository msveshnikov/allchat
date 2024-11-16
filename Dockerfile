# Use the official Node.js image as the base image
FROM --platform=$BUILDPLATFORM node:20-slim AS build

# Set the working directory in the container
WORKDIR /app

# Copy the package.json and package-lock.json files
COPY package*.json ./

# Install the dependencies
RUN npm install

# Copy the rest of the application code
COPY . .

ENV VITE_API_URL https://allchat.online/api
ENV VITE_WS_URL wss://allchat.online/ws
ENV VITE_GOOGLE_CLIENT_ID 740039779548-p80d07b56mk31vgaht4rlh74je8oku28.apps.googleusercontent.com

# Build the React app for production
RUN npm run build

# Use a lightweight server to serve the built React app
FROM nginx:stable-alpine
COPY --from=0 /app/dist /usr/share/nginx/html
RUN rm /etc/nginx/conf.d/default.conf
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]