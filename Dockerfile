# Use an official Node.js runtime as the base image
FROM node:18

# Set the working directory in the container to /app
WORKDIR /app

# Copy package.json and package-lock.json to the working directory
COPY package*.json ./

# Install the application dependencies
RUN npm install

COPY abis ./abis
COPY src ./src
COPY ponder* ./

# The command that will be run when the container starts
CMD [ "npm", "run", "start"]