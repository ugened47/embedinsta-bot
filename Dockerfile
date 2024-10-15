# Use an official Node runtime as the parent image
FROM node:latest

# Set the working directory in the container
WORKDIR /usr/src/app

# Copy package.json and yarn.lock
COPY package*.json yarn.lock ./

# Install dependencies
RUN yarn install

# Copy the rest of the application code
COPY . .

# Compile TypeScript to JavaScript
RUN yarn build

# Expose the port the app runs on
EXPOSE 8080

# Define the command to run the app
CMD ["node", "dist/index.js"]
