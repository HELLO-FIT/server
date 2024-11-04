import { INestApplication } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
export function setupSwagger(app: INestApplication) {
  const config = new DocumentBuilder()
    .setTitle('WIP API')
    .setDescription('WIP API description')
    .setVersion('1.0')
    .addBearerAuth()
    .addTag('WIP')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);
}
