# Stage 1: Build Vue.js application
FROM node:18-alpine AS build-stage

WORKDIR /usr/src/app

COPY package*.json ./


RUN npm cache clean --force

# Install dependencies
RUN npm install

# Copy and build the application
COPY . .

# ⬅️ Increase memory limit here (2GB or more)
# ENV NODE_OPTIONS=--max-old-space-size=2048
# RUN npm run build
# Build the app with explicit memory limit
RUN node --max-old-space-size=4096 node_modules/vite/bin/vite.js build

# Stage 2: Serve the application using a lightweight image
FROM nginx:alpine

# Copy built artifacts from the previous stage
COPY --from=build-stage /usr/src/app/dist /usr/share/nginx/html

# Expose port 80
EXPOSE 80

# Command to run nginx
CMD ["nginx", "-g", "daemon off;"]