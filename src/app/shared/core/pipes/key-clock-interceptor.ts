import { Injectable } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthenticationService } from '../../services/authentication.service';
import { environment } from 'src/environments/environment';


@Injectable()
export class KeyClockInterceptor implements HttpInterceptor{


    constructor(private auth:AuthenticationService){
   
    }

    intercept(request:HttpRequest<any>, next:HttpHandler):Observable<HttpEvent<any>>{

        const user = this.auth.userValue;
        const isLoggedIn = user && user.token
        const isApiUrl =  request.url.startsWith(environment.API_URL)
        if(isLoggedIn && isApiUrl)
        {
            request  = request.clone({
                setHeaders:{
                    Authorization:`Bearer ${user.token}`
                }
            })
        }
        return next.handle(request)
    }
}