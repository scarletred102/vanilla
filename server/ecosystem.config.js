module.exports = {
  apps: [{
    name: 'vinyl-store-server',
    script: 'dist/server.js',
    instances: 'max',
    autorestart: true,
    watch: false,
    max_memory_restart: '1G',
    env: {
      NODE_ENV: 'production',
      PORT: 5000,
    },
    env_production: {
      NODE_ENV: 'production',
    },
  }],
}; 