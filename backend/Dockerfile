# Use the official Node.js image as the base image
FROM node:14

# Set the working directory
WORKDIR /backend

# Copy package.json and package-lock.json to the working directory
COPY package*.json ./

# Install the dependencies
RUN npm install

# Copy the rest of the application code
COPY . .

# Expose the port that the server will run on
EXPOSE 3000

# Start the server
CMD [ "node", "server.js" ]
