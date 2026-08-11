import { ArgumentsHost, Catch, ExceptionFilter, HttpException, HttpStatus } from "@nestjs/common";
import { Request, Response } from "express";
import { randomUUID } from "node:crypto";

@Catch()
export class ProblemFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    const response = host.switchToHttp().getResponse<Response>();
    const request = host.switchToHttp().getRequest<Request>();
    const correlationId = String(request.headers["x-correlation-id"] ?? randomUUID());
    const status = exception instanceof HttpException ? exception.getStatus() : HttpStatus.INTERNAL_SERVER_ERROR;
    if (!(exception instanceof HttpException)) {
      const error = exception instanceof Error ? exception : new Error(String(exception));
      console.error(JSON.stringify({ correlationId, method: request.method, path: request.originalUrl, status, name: error.name, message: error.message, stack: error.stack }));
    }
    const raw = exception instanceof HttpException ? exception.getResponse() : null;
    const body = typeof raw === "object" && raw ? raw as Record<string, unknown> : {};
    const code = String(body.code ?? (status === 500 ? "INTERNAL_ERROR" : "REQUEST_FAILED"));
    response.status(status).type("application/problem+json").send({
      type: `https://api.fluentia.app/problems/${code.toLowerCase().replaceAll("_", "-")}`,
      title: status === 500 ? "Unexpected server error" : String(body.error ?? "Request failed"),
      status, code, detail: status === 500 ? "The request could not be completed." : body.message,
      instance: request.originalUrl, correlationId
    });
  }
}
