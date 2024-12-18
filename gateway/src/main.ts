import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { GatewayModule } from './gateway.module';
// import { ConfigService } from './config/config.service';

async function bootstrap() {
  const app = await NestFactory.create(GatewayModule);
  const options = new DocumentBuilder()
    .setTitle('NestJS-Microservice-Gateway')
    .setVersion('v1')
    .addTag('user')
    .addTag('task')
    .addBearerAuth(
      {
        type: 'http',
        bearerFormat: 'JWT',
        in: 'header',
        scheme: 'bearer',
      },
      'Authorization',
    )
    .build();
  const document = SwaggerModule.createDocument(app, options);
  SwaggerModule.setup('/', app, document);
  // const configService = app.get(ConfigService);
  // console.log(configService.get('port'));
  // app.useGlobalFilters(new AllExceptionsFilter());
  await app.listen(4000, () => {
    console.log('http://localhost:' + 4000);
  });
}
bootstrap();
