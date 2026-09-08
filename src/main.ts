import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  const swaggerConfig = new DocumentBuilder()
    .setTitle('DevOps Tasks API')
    .setDescription(
      'API de tareas para prácticas DevOps. Incluye CRUD de tasks, health check y métricas Prometheus.',
    )
    .setVersion('1.0')
    .addTag('app', 'Endpoints generales de la aplicación')
    .addTag('tasks', 'CRUD de tareas')
    .addTag('metrics', 'Métricas Prometheus')
    .build();
  const document = SwaggerModule.createDocument(app, swaggerConfig);
  SwaggerModule.setup('api', app, document);

  await app.listen(process.env.PORT ?? 3000);
}
void bootstrap();
