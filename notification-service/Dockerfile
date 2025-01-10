# Use Node.js version 18
FROM node:18

# Set the working directory
WORKDIR /app

# Copy package.json and package-lock.json files
COPY package*.json ./

# Install dependencies
RUN npm install


COPY . .

# Build the TypeScript code
RUN npm run build



# Expose the required port
EXPOSE 4008

# Start the application
CMD ["npm", "run", "start"]