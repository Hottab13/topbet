import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import * as dotenv from 'dotenv';
dotenv.config();
//import { ValidatePipe } from './pipes/validation.pipe';

async function start() {
  const PORT = process.env.PORT;
  const app = await NestFactory.create(AppModule);

  app.enableCors({
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    credentials: true,
    origin: true,
  });
  const config = new DocumentBuilder()
    .setTitle('Sports bookmaker')
    .setDescription('REST API Documentation')
    .setVersion('1.0.0')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document);

  //app.useGlobalPipes(new ValidatePipe());
  await app.listen(PORT, () =>
    console.log(`The server is running on the port ${PORT}`),
  );
}
start();
