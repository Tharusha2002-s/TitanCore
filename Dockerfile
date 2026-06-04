# Stage 1: Build the Vite frontend
FROM node:20-alpine AS frontend-builder
WORKDIR /app/frontend
COPY frontend/package*.json ./
RUN npm ci
COPY frontend/ ./
# Set VITE_API_URL to /api for relative API requests in production
ENV VITE_API_URL=/api
RUN npm run build

# Stage 2: Setup the Node backend
FROM node:20-alpine
WORKDIR /app

# Create uploads directory
RUN mkdir -p backend/uploads

# Install backend dependencies
COPY backend/package*.json ./backend/
RUN cd backend && npm ci --only=production

# Copy backend files
COPY backend/ ./backend/

# Copy the built frontend files from the builder stage
COPY --from=frontend-builder /app/frontend/dist ./frontend/dist

# Expose the API port
ENV PORT=5000
ENV NODE_ENV=production
EXPOSE 5000

# Start the server
CMD ["node", "backend/server.js"]
