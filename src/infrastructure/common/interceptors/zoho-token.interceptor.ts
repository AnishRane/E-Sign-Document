import {
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  Injectable,
} from '@nestjs/common';
import { Observable, from, switchMap, tap } from 'rxjs';
import { ZohoOauthTokenService } from 'src/infrastructure/integrations/zoho';

@Injectable()
export class TokenInterceptorNew implements NestInterceptor {
  constructor(private zohoOauthTokenService: ZohoOauthTokenService) {}
  intercept(
    context: ExecutionContext,
    next: CallHandler<any>,
  ): Observable<any> | Promise<Observable<any>> {
    if (!this.zohoOauthTokenService.isTokenValid()) {
      return from(this.zohoOauthTokenService.generateToken()).pipe(
        tap(() =>
          console.log(
            `New Token Generated at ${Math.round(Date.now() / 1000)}`,
          ),
        ),
        switchMap(() => next.handle()),
      );
    }
    return next.handle();
  }
}
