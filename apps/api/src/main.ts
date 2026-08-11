import "reflect-metadata";
import { ConfigService } from "@nestjs/config";
import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import { configureApplication } from "./configure-application";

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { bufferLogs: true });
  configureApplication(app);
  const config = app.get(ConfigService);
  await app.listen(config.get<number>("PORT") ?? 3001, "0.0.0.0");
}
void bootstrap();