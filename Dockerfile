# Use the official Node.js image as a base
FROM node:18

# Set the working directory inside the container
WORKDIR /app

# Copy package.json and package-lock.json (if available)
COPY package*.json ./

# Install dependencies with --legacy-peer-deps to resolve conflicts
RUN npm install --legacy-peer-deps

# Copy the rest of the application files
COPY . .

# Build the Next.js application
RUN npm run build

# Verify that the .next directory exists (Debugging Step)
RUN ls -l .next

# Expose port 85 to the outside world
EXPOSE 85

# Set the PORT environment variable
ENV PORT 85

# Start the application in production mode
CMD ["npm", "start"]
