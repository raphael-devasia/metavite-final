# Use Node.js version 18
FROM node:18

# Set the working directory
WORKDIR /app

# Copy package.json and package-lock.json files
COPY package*.json ./

# Install dependencies
RUN npm install

# Create the target directory
RUN mkdir -p /app/metaVite_Proto_Files

# Clone and move files
RUN git clone https://github.com/raphael-devasia/metaVite_Proto_Files.git /app/temp_protos && \
    cp -r /app/temp_protos/* /app/metaVite_Proto_Files/ && \
    rm -rf /app/temp_protos

# Verify the files are in place (for debugging)
RUN ls -la /app/metaVite_Proto_Files
# Copy the application code
COPY . .

# Build the TypeScript code
RUN npm run build



# Expose the required port
EXPOSE 3003

# Start the application
CMD ["npm", "run", "start"]