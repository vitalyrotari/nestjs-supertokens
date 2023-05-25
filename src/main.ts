import supertokens from 'supertokens-node';
import helmet from 'helmet';
import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { Logger, LoggerErrorInterceptor } from 'nestjs-pino';
import { AppModule } from './app.module';
import { SupertokensExceptionFilter } from './auth/auth.filter';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule, {
    bufferLogs: true,
  });

  app.useLogger(app.get(Logger));
  app.useGlobalInterceptors(new LoggerErrorInterceptor());

  app.getHttpAdapter().getInstance().set('etag', false);
  app.use(helmet());
  app.enableCors({
    origin: ['http://localhost:3000', 'http://localhost:5173'],
    allowedHeaders: ['content-type', ...supertokens.getAllCORSHeaders()],
    credentials: true,
    methods: ['GET', 'PUT', 'OPTIONS', 'POST', 'DELETE'],
  });

  app.useGlobalFilters(new SupertokensExceptionFilter());

  await app.listen(8000, '0.0.0.0');
}
bootstrap();
