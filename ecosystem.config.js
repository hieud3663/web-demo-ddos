module.exports = {
  apps: [
    {
      name: 'web-demo-ddos',
      script: 'node_modules/next/dist/bin/next',
      args: 'start',
      instances: 1,
      exec_mode: 'fork',
      // PM2 sẽ đợi 180000 milliseconds (tương đương 3 phút) rồi mới khởi động lại app sau khi app bị crash
      restart_delay: 180000, 
      env: {
        NODE_ENV: 'production',
        PORT: 3000,
      },
    },
  ],
};
