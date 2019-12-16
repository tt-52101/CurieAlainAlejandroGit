import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { LoginService } from '@core/services/login.service';
import { environment } from '@env/environment';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor(private loginService: LoginService, private router: Router) { }

  canActivate(
    next: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {
    const token = next.queryParams.token;
    
    if (token !== undefined) {
      return new Promise<boolean>(async (resolve, reject) => {
        try {
          if (!this.loginService.token) {
            this.loginService.usertoken = token;
            await this.loginService.refreshLogin(token).toPromise();
          }
          resolve(true);
        } catch (error) {
          console.error(error);
          reject();
        }
      });
    } else {
      this.router.navigate(['/exception/401']);
    }

  }
}
