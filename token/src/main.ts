import { NestFactory } from '@nestjs/core';
import { TokenModule } from './token.module';
import { TcpOptions } from '@nestjs/microservices';

async function bootstrap() {
  const app = await NestFactory.createMicroservice(TokenModule, {
    options: {
      host: '0.0.0.0',
      port: 4002,
    },
  } as TcpOptions);
  await app.listen();
  console.log('tokenService: http://localhost:4002');
}
bootstrap();
