# Use the official Node.js image as the base image
FROM node:14

# Set the working directory
WORKDIR /frontend

# Copy package.json and package-lock.json to the working directory
COPY package*.json ./

# Install the dependencies
RUN npm install react-router-dom localforage match-sorter sort-by

# Copy the rest of the application code
COPY . .

# Expose the port that the server will run on
EXPOSE 8080

# Start the development server
CMD ["npm", "start"]
