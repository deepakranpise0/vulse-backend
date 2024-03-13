# Use official Node.js image as base image
FROM node:21.4.0

# Set working directory within the container
WORKDIR /usr/src/app

# Copy package.json and package-lock.json to the working directory
COPY package*.json ./

# Install dependencies
RUN npm install

# Install Prisma globally (optional)
RUN npm install -g prisma

# Copy Prisma schema file to the working directory
COPY prisma/schema.prisma ./

# Generate Prisma client
RUN prisma generate

# Copy all application files to the working directory
COPY . .

# Expose the port your app runs on
EXPOSE 4200

# Command to run the application
CMD ["node", "index.js"]
