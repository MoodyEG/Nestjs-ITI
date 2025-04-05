import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const config = new DocumentBuilder()
    .setTitle('Nest Lab')
    .setDescription('The Nest API description')
    .setVersion('1.0')
    .addTag('schools')
    .addBearerAuth()
    .build();
  const documentFactory = () => SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api-docs', app, documentFactory);

  app.useGlobalPipes(new ValidationPipe());

  const port = process.env.PORT ?? 6340;
  await app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
  });
}
// eslint-disable-next-line @typescript-eslint/no-floating-promises
bootstrap();
