# Use official Node.js runtime as a parent image
FROM node:22-alpine

# Set working directory in container
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci --only=production

# Copy the rest of the application
COPY . .

# Build the frontend
RUN npm run build

# Expose the port
EXPOSE 4000

# Set production environment
ENV NODE_ENV=production

# Start the backend server
CMD ["node", "server/index.js"]
