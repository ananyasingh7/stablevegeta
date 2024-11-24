# Use Node.js base image
FROM node:18-alpine

# Set working directory
WORKDIR /app

# Copy package files
COPY package.json package-lock.json ./

# Install production dependencies
RUN npm install --production

# Copy all application files
COPY . .

# Build the application
RUN npm run build

# Change working directory to standalone output
WORKDIR /app/.next/standalone

# Expose the correct port
EXPOSE 8080

# Start the standalone application
CMD ["node", "server.js", "--port", "$PORT"]