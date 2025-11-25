module.exports = {
  apps: [
    {
      name: 'documents-app',
      script: 'npm',
      args: 'start',
      cwd: '/var/documents',
      instances: 1,
      autorestart: true,
      watch: false,
      max_memory_restart: '1G',
      env: {
        NODE_ENV: 'production',
        NODE_OPTIONS: '--max-old-space-size=4096',
        PORT: 8082,
      },
      env_production: {
        NODE_ENV: 'production',
      },
    },
  ],
};
