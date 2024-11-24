# Use Node.js base image
FROM node:18-alpine

# Set working directory
WORKDIR /app

# Copy package files
COPY package.json package-lock.json ./

# Install production dependencies
RUN npm install --production

# Copy the rest of the application files
COPY . .

# Build the application
RUN npm run build

# Set environment variables
ENV PORT=8080
ENV HOSTNAME=0.0.0.0

# Expose the port
EXPOSE 8080

# Start the application
CMD ["npm", "run", "start"]