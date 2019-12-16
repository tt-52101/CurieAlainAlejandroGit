import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, RouterStateSnapshot } from '@angular/router';
import { environment } from '@env/environment';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CrmGuard implements CanActivate {
  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {
    let response = true;
    const url: string = state.url.toString().split('?')[0].split('/')[2];
    const acceptedUrl: Set<string> = new Set(['imputation', 'kanban', 'fileManager', 'newsletter','connections']);
    if (environment.production && !acceptedUrl.has(url)) {
      response = false;
      location.href = `${environment.domain}/crm`;
    }
    return response;
  }
}
