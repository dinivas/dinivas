import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  private readonly logger = new Logger(AllExceptionsFilter.name);

  catch(exception: any, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();
    const request = ctx.getRequest();
    const status =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;
    if (status === HttpStatus.INTERNAL_SERVER_ERROR) {
      this.logger.error(`Exception: ${exception}`, exception.stack);
    }
    const exceptionMessage =
      exception instanceof HttpException
        ? exception.message
        : 'Technical error, please contact the administrator, or retry later';
    response.status(status).json({
      statusCode: status,
      message: exceptionMessage,
      timestamp: new Date().toISOString(),
      path: request.url,
    });
  }
}
