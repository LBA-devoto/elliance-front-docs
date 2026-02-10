import { Injectable } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor } from '@angular/common/http';
import { Observable } from 'rxjs';
import { finalize } from 'rxjs/operators';
import { LoadingService } from '../services/loading.service';

@Injectable()
export class LoadingInterceptor implements HttpInterceptor {
    private totalRequests = 0;

    constructor(private loadingService: LoadingService) {}

    intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
        // cette partie me permet de ne pas faire appel au chargement de page lorsque les parametres d'une template effectue des equêtes en arriere plan
        if (
            request.url.startsWith('/entite') ||
            request.url.endsWith('no-show-loading') ||
            request.url.includes('/dynamic_legal_entity')
        ) {
            this.loadingService.setLoading(false);
            return next.handle(request);
        } else {
            this.totalRequests++;
           
            this.loadingService.setLoading(true);
            // loading mark

            const el = document.getElementById('outter-loading');
            el?.parentNode?.removeChild(el);

            document
                .getElementsByTagName('body')[0]
                .insertAdjacentHTML(
                    'beforeend',
                    "<div id='outter-loading' class='backdrop'><div id='loading-mark'><div class='lds-ring'><div></div><div></div><div></div><div></div></div></div></div>"
                );

                
        }

        return next.handle(request).pipe(
            finalize(() => {
                if (this.totalRequests <= 3) {
                    this.totalRequests = 0;
                }
                this.totalRequests--;
                if (this.totalRequests <= 0) {
                    this.loadingService.setLoading(false);
                    const el = document.getElementById('outter-loading');
                    el?.parentNode?.removeChild(el);
                }
            })
        );
    }
}