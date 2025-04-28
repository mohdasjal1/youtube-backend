# Use Node.js v20 base image
FROM node:20-alpine

# Set working directory in container
WORKDIR /app

# Copy package.json and install deps
COPY package.json package-lock.json ./

#Install dependencies
RUN npm install

# Copy the rest of the app
COPY . .

# Expose the port your app runs on
EXPOSE 8000

# Define environment variables (you can also do this in the docker-compose file)
ENV MONGODB_URI=$MONGODB_URI
ENV CLOUDINARY_CLOUD_NAME=$CLOUDINARY_CLOUD_NAME
ENV CLOUDINARY_API_KEY=$CLOUDINARY_API_KEY
ENV CLOUDINARY_API_SECRET=$CLOUDINARY_API_SECRET
ENV ACCESS_TOKEN_SECRET=$ACCESS_TOKEN_SECRET
ENV REFRESH_TOKEN_SECRET=$REFRESH_TOKEN_SECRET
ENV CORS_ORIGIN=$CORS_ORIGIN


# Start your app
CMD ["npm", "start"]
