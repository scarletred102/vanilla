#!/bin/bash

# Exit on error
set -e

echo "🚀 Starting deployment process..."

# Install Node.js and npm if not already installed
if ! command -v node &> /dev/null; then
    echo "📦 Installing Node.js..."
    curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
    sudo apt-get install -y nodejs
fi

# Install PM2 globally if not already installed
if ! command -v pm2 &> /dev/null; then
    echo "📦 Installing PM2..."
    sudo npm install -g pm2
fi

# Install MongoDB if not already installed
if ! command -v mongod &> /dev/null; then
    echo "📦 Installing MongoDB..."
    wget -qO - https://www.mongodb.org/static/pgp/server-6.0.asc | sudo apt-key add -
    echo "deb [ arch=amd64,arm64 ] https://repo.mongodb.org/apt/ubuntu focal/mongodb-org/6.0 multiverse" | sudo tee /etc/apt/sources.list.d/mongodb-org-6.0.list
    sudo apt-get update
    sudo apt-get install -y mongodb-org
    sudo systemctl start mongod
    sudo systemctl enable mongod
fi

# Create application directory
echo "📁 Creating application directory..."
sudo mkdir -p /var/www/vinyl-store
sudo chown -R $USER:$USER /var/www/vinyl-store

# Clone the repository (if not already cloned)
if [ ! -d "/var/www/vinyl-store/.git" ]; then
    echo "📥 Cloning repository..."
    git clone https://github.com/yourusername/vinyl-record-store.git /var/www/vinyl-store
fi

# Navigate to the application directory
cd /var/www/vinyl-store

# Install dependencies
echo "📦 Installing dependencies..."
cd server
npm install
cd ../client
npm install

# Build the client
echo "🏗️ Building client..."
npm run build

# Build the server
echo "🏗️ Building server..."
cd ../server
npm run build

# Create production environment files
echo "🔧 Setting up environment variables..."
cat > .env << EOL
PORT=5000
MONGODB_URI=mongodb://localhost:27017/vinyl-store
JWT_SECRET=$(openssl rand -base64 32)
STRIPE_SECRET_KEY=your_stripe_secret_key
STRIPE_WEBHOOK_SECRET=your_stripe_webhook_secret
NODE_ENV=production
EOL

# Start the application with PM2
echo "🚀 Starting application..."
pm2 start ecosystem.config.js --env production

# Save PM2 process list
pm2 save

# Setup PM2 to start on system boot
pm2 startup

echo "✅ Deployment completed successfully!"
echo "📝 Please update the following in the server/.env file:"
echo "   - STRIPE_SECRET_KEY"
echo "   - STRIPE_WEBHOOK_SECRET"
echo "   - Any other environment-specific variables" 