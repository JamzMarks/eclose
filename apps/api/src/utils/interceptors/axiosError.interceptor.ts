import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
  HttpException,
  InternalServerErrorException,
} from '@nestjs/common';
import { Observable, catchError, throwError } from 'rxjs';
import { AxiosError } from 'axios';

@Injectable()
export class AxiosErrorInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle().pipe(
      catchError((error) => {
        // 👇 Ignora erros que já são do tipo HttpException (ex: BadRequestException)
        if (error instanceof HttpException && !error['isAxiosError']) {
          return throwError(() => error);
        }

        if (error.isAxiosError) {
          const axiosError = error as AxiosError;
          const status = axiosError.response?.status || 500;
          const data = axiosError.response?.data as { message?: string } | undefined;
          const message = data?.message || 'Erro na comunicação com o serviço';
          return throwError(() => new HttpException(message, status));
        }

        console.error('Erro inesperado no gateway', error);
        return throwError(() => new InternalServerErrorException('Erro inesperado no gateway'));
      }),
    );
  }
}
