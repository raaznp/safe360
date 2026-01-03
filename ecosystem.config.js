module.exports = {
  apps: [
    {
      name: 'safe360-server',
      script: 'server/server.js',
      instances: 1,
      autorestart: true,
      watch: true, // Restart on file changes (User requested "restart on change")
      ignore_watch: ['node_modules', 'uploads', 'client', '.git'], // Ignore these to prevent loop
      max_memory_restart: '1G',
      env: {
        NODE_ENV: 'development'
      },
      env_production: {
        NODE_ENV: 'production'
      }
    }
  ]
};
