# Backend Dockerfile (clean, production-ready)
FROM node:20-alpine

# Set working directory
WORKDIR /app

# Copy package files first (better layer caching)
COPY package*.json ./

# Install dependencies
RUN npm install --production

# Copy the rest of the source code
COPY . .

# Expose backend port
EXPOSE 3001

# Start the server
CMD ["npm", "start"]
