import { INestApplication } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
export function setupSwagger(app: INestApplication) {
  const config = new DocumentBuilder()
    .setTitle('HELLOFIT API')
    .setDescription('HELLOFIT API description')
    .setVersion('1.0')
    .addBearerAuth()
    .addTag('HELLOFIT')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);
}
