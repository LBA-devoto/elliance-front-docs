import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpErrorResponse,
} from '@angular/common/http';
import { catchError, Observable, throwError } from 'rxjs';
import { Router } from '@angular/router';
import { PATHS } from 'src/app/app-routing.module';

@Injectable()
export class BasicAuthInterceptor implements HttpInterceptor {
  //baseUrl ='/auth/realms/bebeimage/protocol/openid-connect/token';
  baseUrl = '/user/login';

  constructor(private router: Router) {}

  private handleAuthError(err: HttpErrorResponse): Observable<any> {
    if (err.status === 403 || err.status === 401) {
      //this.router.navigate(['/login']);
      return throwError(err);
    }
    return throwError(err);
  }

  intercept(
    request: HttpRequest<unknown>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    //

    if (request.url !== this.baseUrl) {
      let token = localStorage.getItem('token')
        ? localStorage.getItem('token')
        : '';
      //
      if (token === '') {
        token = sessionStorage.getItem('token')
          ? sessionStorage.getItem('token')
          : '';
      }
      if (
        request.url.includes('user/') ||
        request.url.includes('personnemorale/') ||
        request.url.includes(PATHS.product) ||
        request.url.includes('elk/') ||
        request.url.includes('assets/mock-apis') ||
        request.url.includes('produit/') ||
        request.url.includes('entite/') ||
        request.url.includes('parametre/') ||
        request.url.includes('retrievepassword/reset')
      ) {
        return next.handle(request);
      }

      request = request.clone({
        setHeaders: {
          Authorization: `Bearer ${token}`,
          Token: `${token}`,
        },
      });
    }
    //return next.handle(request)
    return next.handle(request).pipe(
      catchError((x) => {
        return this.handleAuthError(x);
      })
    );
  }
}
