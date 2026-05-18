module.exports = {
  apps: [
    {
      name: 'web-demo-ddos',
      script: 'npm',
      args: 'start',
      instances: 'max', // Scale up to the number of CPU cores, useful for handling more requests
      exec_mode: 'cluster', // Enables cluster mode
      env: {
        NODE_ENV: 'production',
        PORT: 3000,
      },
    },
  ],
};
