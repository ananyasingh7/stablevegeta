# Base on Node 21
FROM node:21-alpine

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy all files
COPY . .

# Set environment variables
ENV PORT=8080
ENV NODE_ENV=production

# Build the Next.js application
RUN npm run build

# Expose port 8080
EXPOSE 8080

# Add logging to help debug startup issues
CMD echo "Starting Next.js application..." && \
    echo "PORT=$PORT" && \
    echo "NODE_ENV=$NODE_ENV" && \
    npm start