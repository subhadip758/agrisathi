# Use official Node.js + Python combined runtime base image
FROM node:18-bullseye-slim

# Install Python 3 and OpenCV system dependencies
RUN apt-get update && apt-get install -y \
    python3 \
    python3-pip \
    libgl1-mesa-glx \
    libglib2.0-0 \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /app

# Copy Package files and install Node.js dependencies
COPY package*.json ./
RUN npm ci --only=production

# Copy Python requirements and install ML dependencies
COPY requirements.txt ./
RUN pip3 install --no-cache-dir -r requirements.txt

# Copy source code and ML models
COPY . .

# Expose port and start backend server
EXPOSE 5180
ENV PORT=5180
ENV NODE_ENV=production

CMD ["node", "src/server.js"]