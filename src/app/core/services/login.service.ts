import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '@env/environment';
import { User } from '@shared/models/User';
import { BasicUser } from '@shared/typings/User';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';


@Injectable({
  providedIn: 'root'
})
export class LoginService {

  token: string = null;
  user: User;
  usertoken: string = null;

  constructor(private http: HttpClient) { }

  /**
   * Inicia la sesión en el crm, obteniendo su informacion personal y token de acceso
   * @param user usuario a loguear en el crm
   * @param remember decide si se almacenan los datos del ususario para un futuro autologin o no (false por defecto)
   */
  login(user: BasicUser, remember: boolean = false): Observable<any> {
    return this.http.post(`${environment.baseurl}/Users/Login`, user).pipe(
      tap((userInfo: any) => {
        this.parseLoginResponse(userInfo.result);
        if (remember) {
          localStorage.setItem('userToken', userInfo.token);
        }
      })
    );
  }

  /**
   * Refresca el login de un usuario mediante su token personal
   * @param token token para loguear un usuario concreto
   */
  refreshLogin(token: string): Observable<any> {
    return this.http.get(`${environment.baseurl}/Login?token=${token}`).pipe(
      tap((userInfo: any) => {
        this.parseLoginResponse(userInfo.result);
      })
    );
  }

  /**
   * Parsea la respuesta obtenida por un login o refresco del mismo
   * @param loginInfo información de usuario obtenida
   */
  private parseLoginResponse(loginInfo: any) {
    this.token = loginInfo.token;
    this.user = new User({
      id: loginInfo.userid,
      name: loginInfo.name,
      company: loginInfo.company,
      roles: [loginInfo.role],
      preferences: loginInfo.preferences
    });
  }

  /**
   * Cierra la sesión
   */
  async logout() {
    this.token = null;
    this.user = null;
    localStorage.removeItem('userToken');
    // TODO: eliminar de localstorage si procede
  }

}
