# Use official lightweight Node.js 20 Alpine base image
FROM node:20-alpine

# Set working directory inside container
WORKDIR /usr/src/app

# Set production environment
ENV NODE_ENV=production
ENV PORT=3000

# Copy package configuration files
COPY package*.json ./

# Install only production dependencies
RUN npm ci --omit=dev --ignore-scripts

# Copy application source code
COPY src/ ./src/

# Use non-root node user for security
USER node

# Expose application port
EXPOSE 3000

# Health check to monitor container health
HEALTHCHECK --interval=30s --timeout=5s --start-period=5s --retries=3 \
  CMD wget --no-verbose --tries=1 --spider http://localhost:3000/health || exit 1

# Start application
CMD ["node", "src/server.js"]
