# Use an official Node.js runtime as a parent image
FROM node:20

# Set the working directory in the container
WORKDIR /usr/src/app

# Copy package.json and package-lock.json to the working directory
COPY package*.json ./

# Install application dependencies
RUN npm install \
  express \
  express-validator \
  mongoose \
  node-gyp \
  bcrypt \
  jsonwebtoken \
  axios


# Copy the rest of the application source code to the working directory
COPY . .

# Expose port
EXPOSE ${APP_PORT}

# Start the Node.js application
CMD ["node", "server.js"]
