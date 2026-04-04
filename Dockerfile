# Stage 1: Build Vue.js application
FROM node:18-alpine AS build-stage

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm cache clean --force && npm ci --no-audit --no-fund

# Copy and build the application
COPY . .

# Let Node use the memory available in the build container instead of forcing
# a large heap reservation that can fail on smaller builders.
RUN npm run build

# Stage 2: Serve the application using a lightweight image
FROM nginx:alpine

# Copy built artifacts from the previous stage
COPY --from=build-stage /usr/src/app/dist /usr/share/nginx/html

# Expose port 80
EXPOSE 80

# Command to run nginx
CMD ["nginx", "-g", "daemon off;"]
