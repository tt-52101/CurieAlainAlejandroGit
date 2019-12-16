import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { LoginService } from '@core';
import { environment } from '@env/environment';
import { Observable } from 'rxjs';
import { LoggerService } from '@core/services/logger.service';



@Injectable({
  providedIn: 'root'
})
export class CrmInterceptor implements HttpInterceptor {

  private headers: object = {
    Authorization: `Basic ${btoa(`${environment.auth.user}:${environment.auth.passwd}`)}`,
    Accept: 'application/json',
    'x-api-key': environment.apiKey,
    'Content-Type': 'application/json'
  };

  constructor(
    private loginService: LoginService,
    private logger: LoggerService
  ) { }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    if (req.url.startsWith(environment.baseurl)) {
      this.logger.log('log', `Interceptando peticion a`, decodeURI(req.urlWithParams));
      if (this.loginService.token) {
        req = req.clone({ headers: req.headers.set('x-token', this.loginService.token) });
      }
      Object.keys(this.headers).forEach(e => {
        req = req.clone({ headers: req.headers.set(e, this.headers[e]) });
      });
      this.logger.log('log', `cabeceras añadidas`, req.headers.keys().map(e => `${e}:${req.headers.getAll(e).join(',')}`))
    }
    return next.handle(req);
  }
}
