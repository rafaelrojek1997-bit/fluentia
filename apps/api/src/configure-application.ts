import { INestApplication, ValidationPipe } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";
import cookieParser from "cookie-parser";
import helmet from "helmet";
import { ProblemFilter } from "./common/problem.filter";

export function configureApplication(app: INestApplication): void {
  const config = app.get(ConfigService);
  app.setGlobalPrefix("api/v1");
  app.use(helmet({ contentSecurityPolicy: false }));
  app.use(cookieParser());
  app.enableCors({
    origin: [config.getOrThrow<string>("WEB_ORIGIN")],
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"]
  });
  app.useGlobalPipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true, transform: true, stopAtFirstError: false }));
  app.useGlobalFilters(new ProblemFilter());
  app.enableShutdownHooks();
  const spec = new DocumentBuilder().setTitle("AI English Mentor API").setVersion("1.0").addBearerAuth().build();
  SwaggerModule.setup("api/docs", app, SwaggerModule.createDocument(app, spec), { jsonDocumentUrl: "api/docs/openapi.json" });
}
