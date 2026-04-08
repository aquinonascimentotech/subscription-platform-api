import { buildApp } from './app';
import { config } from './config';

async function start() {
  try {
    const app = await buildApp();

    await app.listen({
      port: config.server.port,
      host: '0.0.0.0',
    });

    console.log('');
    console.log('🚀 Server is running!');
    console.log('');
    console.log(`📝 API Documentation: http://localhost:${config.server.port}/docs`);
    console.log(`🏥 Health Check: http://localhost:${config.server.port}/health`);
    console.log(`🔐 API Base URL: http://localhost:${config.server.port}/api/${config.server.apiVersion}`);
    console.log('');
  } catch (error) {
    console.error('❌ Error starting server:', error);
    process.exit(1);
  }
}

start();
