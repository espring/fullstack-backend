module.exports = {
  deploy : {
    production : {
      user : 'ssh-user',
      host : ['server-name'],
      ref  : 'origin/main',
      repo : 'https://github.com/espring/fullstack-backend/',
      path : '/app/back-end',
      'post-setup': 'npm install',
      'pre-deploy': 'git fetch --all && git reset --hard origin/main',
      'post-deploy' : 'npm install && npm run build && pm2 restart ecosystem.prod.config.js --env production',
      env: {
        NODE_ENV: 'production',
        DATABASE_HOST: '127.0.0.1',
        DATABASE_NAME: 'dbname',
        DATABASE_USERNAME: 'db-user',
        DATABASE_PASSWORD: 'db-password'
      }
    }
  }
}

