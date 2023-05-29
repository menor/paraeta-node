require('dotenv').config();

process.on('uncaughtexception', (err) => {
  console.log('💥 UNCAUGHT EXCEPTION. Shutting down');
  console.log(err.name, err.message);
  process.exit(1);
});

const app = require('./app');

const PORT = process.env.PORT || 4000;
const APP_NAME = process.env.APP_NAME || 'server';

const server = app.listen(PORT, () => {
  console.log(`🔥 ${APP_NAME} running on port ${PORT}`);
});

// This will catch all undhandled promise rejections
process.on('unhandledRejection', (err) => {
  console.log('💥 UNHANDLED REJECTION. Shutting down');
  console.log(err);
  // This gives the server time to finish its work before shutting down
  server.close(() => {
    process.exit(1);
  });
});

process.on('SIGTERM', () => {
  console.log('👋 SIGTERM RECEIVED. Shutting down gracefully');
  server.close(() => {
    console.log('💥 Process terminated!');
  });
});
