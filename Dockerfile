# Use Node.js v16.11.0 or higher as the base image
FROM node:16.11.0

# Set the working directory inside the container
WORKDIR /app

# Copy the package.json and package-lock.json (if present)
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of your application files
COPY . .

# Command to run your bot
CMD ["node", "src/toastbot.js"]