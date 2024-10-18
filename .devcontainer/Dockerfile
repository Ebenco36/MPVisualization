# Stage 1: Build Vue.js application
FROM node:14-alpine AS build-stage

WORKDIR /usr/src/app

COPY package*.json ./


RUN npm cache clean --force

# Install dependencies
RUN npm install

# Copy and build the application
COPY . .
RUN npm run build

# Stage 2: Serve the application using a lightweight image
FROM nginx:alpine

# Copy built artifacts from the previous stage
COPY --from=build-stage /usr/src/app/dist /usr/share/nginx/html

# Expose port 80
EXPOSE 80

# Command to run nginx
CMD ["nginx", "-g", "daemon off;"]
