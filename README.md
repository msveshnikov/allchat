# FREECHAT

Node.js backend and a React MUI frontend for an application that interacts with the Gemini Pro model, with history, image painting via Amazon Titan and markdown support. Written fully by _Claude 3 Sonnet_.

![image](https://github.com/msveshnikov/freechat/assets/8682996/42b2e4f2-b91b-4712-8ef2-630ebb8919e9)

## Demo

https://allchat.online/

**Backend (Node.js)**

1. Set up a new Node.js project and install the necessary dependencies, such as `express`, `cors`, and any libraries required for interacting with the Gemini Pro model.
2. Create an Express server and define the necessary routes for handling HTTP requests from the frontend.
3. Implement the logic for interacting with the Gemini Pro model, which may involve making API calls or using a client library provided by the model's creators.
4. Define the response structure and send the appropriate data back to the frontend.

**Frontend (React MUI)**

1. Set up a new React project using `create-react-app` or your preferred React boilerplate.
2. Install the required dependencies, including `@mui/material` for the Material-UI (MUI) component library.
3. Create the necessary components for the user interface, such as input fields, buttons, and display areas for the model's output.
4. Use React hooks or state management libraries (e.g., Redux) to manage the application state and handle user interactions.
5. Implement the logic for sending HTTP requests to the Node.js backend and handling the responses.
6. Integrate the MUI components with the application logic to create a visually appealing and user-friendly interface.

## Environment variables

You have to get those APIs and set environment variables (or put to .env file):

-   GOOGLE_KEY - key of Google Cloud Project with Vertex AI API enabled
-   google.json - https://console.cloud.google.com/apis/credentials/key
-   AWS_SECRET_KEY
-   AWS_ACCESS_KEY - Titan - https://eu-central-1.console.aws.amazon.com/console/home?region=eu-central-1

**Example Code**

Here's a basic example to get you started:

**Backend (Node.js)**

```javascript
// server.js
const express = require("express");
const cors = require("cors");
const app = express();
const port = 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Route for interacting with the Gemini Pro model
app.post("/interact", (req, res) => {
    const userInput = req.body.input;
    // Implement logic for interacting with the Gemini Pro model
    // and getting the response
    const modelResponse = "This is a sample response from the Gemini Pro model";
    res.json({ response: modelResponse });
});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
```

**Frontend (React MUI)**

```jsx
// App.js
import React, { useState } from "react";
import axios from "axios";
import { Box, TextField, Button } from "@mui/material";

function App() {
    const [input, setInput] = useState("");
    const [response, setResponse] = useState("");

    const handleSubmit = async () => {
        try {
            const res = await axios.post("http://localhost:3000/interact", { input });
            setResponse(res.data.response);
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <Box>
            <TextField label="Enter your input" value={input} onChange={(e) => setInput(e.target.value)} />
            <Button onClick={handleSubmit}>Submit</Button>
            <Box>{response}</Box>
        </Box>
    );
}

export default App;
```

This is a basic example, and you'll need to adapt it to fit your specific requirements and integrate with the Gemini Pro model's API or client library. Additionally, you'll want to add error handling, input validation, and other features to create a robust and user-friendly application.

# DOCKER

To containerize the Node.js backend and React MUI frontend for easy deployment, we can use Docker. Here's how you can create Docker containers for your application:

**Backend (Node.js)**

1. Create a new file called `Dockerfile` in your backend directory with the following contents:

```Dockerfile
# Use the official Node.js image as the base image
FROM node:18

# Set the working directory in the container
WORKDIR /app

# Copy the package.json and package-lock.json files
COPY package*.json ./

# Install the dependencies
RUN npm install

# Copy the rest of the application code
COPY . .

# Expose the port that your backend runs on
EXPOSE 3000

# Start the backend application
CMD ["npm", "start"]
```

2. In the same directory, create a `.dockerignore` file with the following contents:

```
node_modules
.git
```

This will prevent copying the `node_modules` and `.git` directories into the Docker image, keeping the image size smaller.

3. Build the Docker image by running the following command in the backend directory:

```
docker build -t my-backend .
```

Replace `my-backend` with your desired image name.

**Frontend (React MUI)**

1. Create a new file called `Dockerfile` in your frontend directory with the following contents:

```Dockerfile
# Use the official Node.js image as the base image
FROM node:18

# Set the working directory in the container
WORKDIR /app

# Copy the package.json and package-lock.json files
COPY package*.json ./

# Install the dependencies
RUN npm install

# Copy the rest of the application code
COPY . .

# Build the React app for production
RUN npm run build

# Use a lightweight server to serve the built React app
FROM nginx:stable-alpine
COPY --from=0 /app/build /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

2. In the same directory, create a `.dockerignore` file with the following contents:

```
node_modules
.git
build
```

This will prevent copying the `node_modules`, `.git`, and `build` directories into the Docker image.

3. Build the Docker image by running the following command in the frontend directory:

```
docker build -t my-frontend .
```

Replace `my-frontend` with your desired image name.

**Running the Containers**

After building the Docker images, you can run the containers using Docker Compose. Create a `docker-compose.yml` file in the root directory of your project with the following contents:

```yaml
version: "3"
services:
    backend:
        image: my-backend
        ports:
            - "3000:3000"
        environment:
            - GOOGLE_KEY=your_google_cloud_project_id
    frontend:
        image: my-frontend
        ports:
            - "80:80"
        depends_on:
            - backend
```

Make sure to replace `my-backend` and `my-frontend` with the names you used when building the Docker images, and replace `your_google_cloud_project_id` with your actual Google Cloud project ID.

Now, you can start the containers by running the following command in the root directory of your project:

```
docker-compose up
```

This will start both the backend and frontend containers, and the frontend will be accessible at `http://localhost`.

With this setup, you can easily deploy your containerized application to any Docker-compatible environment, such as a cloud platform or a local server.

# NGINX

To configure Nginx as a reverse proxy for your containerized Node.js backend and React MUI frontend applications, you can follow these steps:

1. **Install Nginx**

If Nginx is not already installed on your VM instance, you can install it using the appropriate package manager for your operating system. For example, on Ubuntu or Debian-based distributions, you can run:

```
sudo apt-get update
sudo apt-get install nginx
```

2. **Configure Nginx**

Open the default Nginx configuration file, usually located at `/etc/nginx/nginx.conf` or `/etc/nginx/conf.d/default.conf`. You can use a text editor like `nano` or `vim`.

```
sudo nano /etc/nginx/conf.d/default.conf
```

3. **Add Upstream Blocks**

Inside the `http` block, add two upstream blocks to define the locations of your backend and frontend containers:

```nginx
upstream backend {
    server <backend_container_ip>:6000/;
}

upstream frontend {
    server <frontend_container_ip>:80/;
}
```

Replace `<backend_container_ip>` and `<frontend_container_ip>` with the actual IP addresses of your backend and frontend containers, respectively.

4. **Configure Server Blocks**

Next, configure the server blocks for your domain. Inside the `http` block, add the following:

```nginx
server {
    listen 80;
    server_name allchat.online www.allchat.online;

    location /api/ {
        proxy_pass http://backend;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    }

    location / {
        proxy_pass http://frontend;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    }
}
```

This configuration listens on port 80 for requests to `allchat.online` and `www.allchat.online`. It forwards requests to `/api` to your backend container, and all other requests to your frontend container.

5. **Restart Nginx**

Save the changes to the configuration file, and restart Nginx for the changes to take effect:

```
sudo systemctl restart nginx
```

After completing these steps, your Nginx server should now be correctly configured to act as a reverse proxy for your containerized Node.js backend and React MUI frontend applications, serving them at `allchat.online` and `www.allchat.online`.

Note: Make sure that your backend and frontend containers are running and accessible from your Nginx server. You may need to adjust the firewall rules or security groups on your VM instance to allow incoming traffic on the necessary ports.
