import 'dotenv/config';

import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as bodyParser from 'body-parser';
import { ValidationPipe } from '@nestjs/common';
// eslint-disable-next-line @typescript-eslint/no-var-requires
const cors = require('cors');

// Use this after the variable declaration
async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe());
  app.use(cors());
  app.use(bodyParser.json({ limit: '50mb' }));
  await app.listen(parseInt(process.env.PORT) || 3000);
}
bootstrap();
