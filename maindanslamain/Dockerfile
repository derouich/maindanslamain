# Use the official Node.js image as a base
FROM node:18

# Set the working directory inside the container
WORKDIR /app

# Copy package.json and package-lock.json (if available)
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application files
COPY . .

# Expose port 85 to the outside world
EXPOSE 85

# Set environment variables if needed (Optional)
# ENV PORT=85

# Start the application
CMD ["npm", "start"]
