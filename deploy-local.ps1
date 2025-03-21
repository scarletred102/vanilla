# Windows Local Deployment Script
Write-Host "🚀 Starting local deployment process..." -ForegroundColor Green

# Check if Node.js is installed
if (!(Get-Command node -ErrorAction SilentlyContinue)) {
    Write-Host "❌ Node.js is not installed. Please install Node.js from https://nodejs.org/" -ForegroundColor Red
    exit 1
}

# Check if MongoDB is installed
if (!(Get-Command mongod -ErrorAction SilentlyContinue)) {
    Write-Host "❌ MongoDB is not installed. Please install MongoDB from https://www.mongodb.com/try/download/community" -ForegroundColor Red
    exit 1
}

# Create necessary directories
Write-Host "📁 Creating application directories..." -ForegroundColor Yellow
New-Item -ItemType Directory -Force -Path ".\server"
New-Item -ItemType Directory -Force -Path ".\client"

# Install dependencies
Write-Host "📦 Installing server dependencies..." -ForegroundColor Yellow
Set-Location -Path ".\server"
npm install

Write-Host "📦 Installing client dependencies..." -ForegroundColor Yellow
Set-Location -Path "..\client"
npm install

# Build the client
Write-Host "🏗️ Building client..." -ForegroundColor Yellow
npm run build

# Build the server
Write-Host "🏗️ Building server..." -ForegroundColor Yellow
Set-Location -Path "..\server"
npm run build

# Create environment files
Write-Host "🔧 Setting up environment variables..." -ForegroundColor Yellow

# Server environment
@"
PORT=5000
MONGODB_URI=mongodb://localhost:27017/vinyl-store
JWT_SECRET=local_development_secret
STRIPE_SECRET_KEY=your_stripe_secret_key
STRIPE_WEBHOOK_SECRET=your_stripe_webhook_secret
NODE_ENV=development
"@ | Out-File -FilePath ".\server\.env" -Encoding UTF8

# Client environment
@"
REACT_APP_API_URL=http://localhost:5000/api
REACT_APP_STRIPE_PUBLISHABLE_KEY=your_stripe_publishable_key
"@ | Out-File -FilePath ".\client\.env" -Encoding UTF8

Write-Host "✅ Local deployment completed successfully!" -ForegroundColor Green
Write-Host "📝 Please update the following environment variables:" -ForegroundColor Yellow
Write-Host "   - In server/.env:" -ForegroundColor Yellow
Write-Host "     * STRIPE_SECRET_KEY" -ForegroundColor Yellow
Write-Host "     * STRIPE_WEBHOOK_SECRET" -ForegroundColor Yellow
Write-Host "   - In client/.env:" -ForegroundColor Yellow
Write-Host "     * REACT_APP_STRIPE_PUBLISHABLE_KEY" -ForegroundColor Yellow
Write-Host "`n🚀 To start the application:" -ForegroundColor Green
Write-Host "1. Start MongoDB service" -ForegroundColor Yellow
Write-Host "2. Open a new terminal and run: cd server && npm start" -ForegroundColor Yellow
Write-Host "3. Open another terminal and run: cd client && npm start" -ForegroundColor Yellow 