# Use the official Node.js image as a base
FROM node:18

# Set the working directory inside the container
WORKDIR /app

# Copy package.json and package-lock.json (if available)
COPY package*.json ./

# Install dependencies including Next.js
RUN npm install

# Copy the rest of the application files
COPY . .

# Check if next is installed correctly
RUN ls -l node_modules/.bin

# Build the Next.js application using npx to avoid "next: not found" error
RUN npx next build

# Expose port 85 to the outside world
EXPOSE 85

# Set the PORT environment variable
ENV PORT 85

# Start the application in production mode
CMD ["npm", "start"]
