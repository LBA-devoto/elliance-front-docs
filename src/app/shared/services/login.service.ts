import {
  HttpClient,
  HttpErrorResponse,
  HttpHeaders,
  HttpParams,
} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { logingReq } from '../entities/authdto/login-requestdto';
import { JwtHelperService, JwtModule } from '@auth0/angular-jwt';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class LoginService {
  success() {
    //     }else if(token.startsWith("e")){
    throw new Error('Method not implemented.');
  }
  token: any;
  refreshToken: any;
  //baseUrl= "http://keycloak:8080/auth/realms/bebeimage/protocol/openid-connect/token";

  loginUrl = '/user/login';
  logoutUrl = '/user/logout';
  forgotUrl = '/user/forgotpassword';
  verifyUrl = '/user/verifyPasswordResetToken';
  resetUrl = '/user/resetPassword';
  verifySSO = '/user/ssoAuthenticate';

  loginreq: logingReq = new logingReq();

  constructor(
    private httpClient: HttpClient,
    private jwtHelper: JwtHelperService,
    private router: Router
  ) {}

  authentification(code: string, motdepasse: string, remember?: boolean) {
    let authenticate = new HttpParams()
      .set('username', code)
      .set('password', motdepasse);

    return this.httpClient
      .post<any>(`${this.loginUrl}`, authenticate, {
        // responseType: 'text' as 'json',
      })
      .pipe(
        map((value: any) => {
          // return value.token
          if (value.responseCode.includes('06')) {
            // bad credentials
            return 'Bad credentials';
          } else if (value.responseCode.includes('00')) {
            // success
            this.token = value.token;
            return value.token;
          } else if (value.responseCode.includes('08')) {
            //inactive account
            return 'Ce compte est inactif';
          } else if (value.responseCode.includes('09')) {
            // link already used

            return 'Lien déjà utilisé';
          } else {
            return 'Error';
          }
        })
      );
  }

  logout(): Observable<any> {
    let token = localStorage.getItem('token');
    let httpOptions = {
      headers: new HttpHeaders({
        Authorization: `Bearer ${token}`,
      }),
    };
    localStorage.removeItem('token');
    localStorage.removeItem('userid');
    localStorage.removeItem('access');
    sessionStorage.removeItem('token');
    sessionStorage.removeItem('userid');
    sessionStorage.removeItem('access');
    this.router.navigate(['/login']);
    return this.httpClient.get(this.logoutUrl, httpOptions);
  }

  private handleError(error: HttpErrorResponse) {
    if (error.status === 0) {
      // A client-side or network error occurred. Handle it accordingly.
      console.error('An error occurred:', error.error);
    } else {
      // The backend returned an unsuccessful response code.
      // The response body may contain clues as to what went wrong.
      console.error(
        `Backend returned code ${error.status}, body was: `,
        error.error
      );
      const token = error.error.text;
    }
  }

  sendRecoveryLink(email: string) {
    return this.httpClient
      .post(
        this.forgotUrl,
        {},
        {
          params: { email },
        }
      )
      .pipe(
        map((resp) => {
          return resp;
        })
      );
  }

  verifyPasswordResetToken(token: string) {
    return this.httpClient
      .post(
        this.verifyUrl,
        {},
        {
          params: { token },
        }
      )
      .pipe(
        map((resp) => {
          return resp;
        })
      );
  }

  changePassword(token: string, newPassword: string) {
    return this.httpClient
      .post(
        this.resetUrl,
        {},
        {
          params: { token: token, newPassword: newPassword },
        }
      )
      .pipe(
        map((resp) => {
          return resp;
        })
      );
  }

  verifySSOAuth(ssoToken: string) {
    let body = new URLSearchParams();
    body.set('ssoToken', ssoToken);

    return this.httpClient
      .post(this.verifySSO, body, {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      })
      .pipe(
        map((resp) => {
          return resp;
        })
      );
  }

  // return this.http.post<any>(`/user/login`,params,{responseType: 'text' as 'json'}).pipe(
  //   map((value) => {
  //     /*let spliteSlash = value.split("\n");
  //     const personne= spliteSlash[0];
  //     const token = spliteSlash[2];
  //     if(personne.startsWith("e")){
  //       localStorage.setItem("token",personne)
  //     }else if(token.startsWith("e")){
  //       localStorage.setItem("token",token)
  //     }*/
  //     this.token = value;
  //     return this.token;
  //   }))
  // }
  // };

  /*const params = new HttpParams({
        fromObject : {
          "grant_type":'password',
          "username": code,
          "password": motdepasse,
          "client_id":'springboot-keycloak',
          "client_secret":'jrPQqbAIJYzWKmYrDqcZXyDISdpU9nMn',
        }
      })*/
  /*let authentification : any ={
        "grant_type":'password',
        "username": code,
        "password": motdepasse,
        "client_id":'springboot-keycloak',
        "client_secret":'jrPQqbAIJYzWKmYrDqcZXyDISdpU9nMn',  
  //     }*/
  //     let auth: any = {
  //       username: code,
  //       password: motdepasse,
  //     };
  //     return this.http
  //       .post<any>(`/auth/realms/bebeimage/protocol/openid-connect/token`, auth)
  //       .pipe(
  //         map((value) => {
  //           this.token = value.access_token;
  //           this.refreshToken = value.refresh_token;
  //           localStorage.setItem('token', this.token);
  //           localStorage.setItem('refreshToken', this.refreshToken);
  //
  //           //  this.isAuthenticated = true;
  //           return this.token;
  //         })
  //       );
  //   }

  //   connexion(code: string, motdepasse: string): Observable<any> {
  //     return this.http.get<any>('');
  //   }
  // }
}
