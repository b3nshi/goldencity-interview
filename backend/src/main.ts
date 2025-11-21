import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { NotesModule } from './NotesModule/notes.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const config = new DocumentBuilder()
    .setTitle('Goldencity')
    .setDescription('API Documentation')
    .setVersion('1.0')
    .build();
  const documentFactory = () =>
    SwaggerModule.createDocument(app, config, {
      include: [NotesModule],
      ignoreGlobalPrefix: true,
    });
  SwaggerModule.setup('api-docs', app, documentFactory, {
    swaggerOptions: { defaultModelsExpandDepth: -1 },
  });

  await app.listen(process.env.PORT ?? 3000);
}

bootstrap().catch(console.error);
