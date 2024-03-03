
FROM node:14-slim

# Set working directory
WORKDIR /usr/src/app

# Copy package.json and package-lock.json
COPY ./package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application code
COPY . .

# Set environment to production
ENV NODE_ENV=production

# Create a non-root user and switch to it for security
RUN useradd -m appuser && chown -R appuser /usr/src/app
USER appuser

# Expose the port the app runs on
EXPOSE 3000

# Command to run the application
CMD ["npm", "start"]