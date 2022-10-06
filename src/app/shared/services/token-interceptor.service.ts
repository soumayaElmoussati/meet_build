import { TokenService } from './token.service';
import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Inject, Injectable, Injector, PLATFORM_ID } from '@angular/core';
import { Observable } from 'rxjs';
import { ɵNullViewportScroller } from '@angular/common';

@Injectable()

export class TokenInterceptorService implements HttpInterceptor {

  constructor(
    private injector: Injector,
  ) { }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    let tokenS = this.injector.get(TokenService);
    let tokenizedreq = req.clone({
      setHeaders: {
        Authorization: req.url.includes('checkPayment')  ? '' : 'Bearer ' + tokenS.get()
      }
    })
    return next.handle(tokenizedreq)
  }

}
