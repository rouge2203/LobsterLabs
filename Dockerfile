# Use the official Nginx image from the Docker Hub
FROM nginx:alpine

# Copy the build output from your React application to the Nginx HTML directory
COPY build /usr/share/nginx/html

# Copy your custom Nginx configuration file to the appropriate location
COPY nginx.conf /etc/nginx/conf.d/default.conf
