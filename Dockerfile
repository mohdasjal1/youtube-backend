# Use Node.js v20 base image
FROM node:20

# Set working directory in container
WORKDIR /app

# Copy package.json and install deps
COPY package*.json ./
RUN npm install

# Copy the rest of the app
COPY . .

# Expose the port your app runs on
EXPOSE 8000

# Start your app
CMD ["npm", "start"]
