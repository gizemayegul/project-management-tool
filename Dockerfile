# Use a specific Node.js version (e.g., Node.js 16.16.0 on Alpine Linux)
FROM node:16.16.0-alpine3.16

# Set the working directory
WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install node packages for both client and server
RUN npm install

# Copy the rest of the application code
COPY ./client ./client
COPY ./server ./server

# Change to client directory and install dependencies
WORKDIR /app/client
RUN npm install

# Change to server directory and install dependencies
WORKDIR /app/server
RUN npm install

# Expose the port the app runs on
EXPOSE 5006

# Change back to the root working directory
WORKDIR /app

# Start the fullstack app
CMD ["npm", "run", "fullstack"]
