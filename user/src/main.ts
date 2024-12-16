import { NestFactory } from '@nestjs/core';
import { UserModule } from './user.module';
import { TcpOptions, Transport } from '@nestjs/microservices';

async function bootstrap() {
  const app = await NestFactory.createMicroservice(UserModule, {
    transport: Transport.TCP,
    options: {
      host: '0.0.0.0',
      port: 4001,
    },
  } as TcpOptions);
  await app.listen();
  console.log('userService: http://localhost:4001');
}
bootstrap();
