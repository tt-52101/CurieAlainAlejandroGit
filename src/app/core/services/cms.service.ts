import { Injectable } from '@angular/core';
import { HttpHeaders, HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class CmsService {

  private url = 'https://localhost:3000/api/cms';

  private url_cms = 'https://ghost.curieplatform.com/imgserver'; 

  constructor(private http: HttpClient) { }

  /**
   * Call the endpoint to activate the pod where the ghost site is published. (QUITAR)
   * @param param 
   */
  activateGhost(param) {
    let headers = new HttpHeaders();
    return this.http.post(`${this.url}/activateghost`, param, { headers: headers });
  }

  /** ---------------------------------------------------
      Función para iniciar session y obtener cookies (QUITAR)
  ---------------------------------------------------- */
  getSession(){ 
    let body = {}
    let headers = new HttpHeaders();
    return this.http.post(`${this.url}/getsession`, body, { headers: headers });
  }


  /** ---------------------------------------------------
          Función para subir imagen al GHOST CMS (QUITAR)
  ---------------------------------------------------- */
  uploadImage(img){
    let headers = new HttpHeaders();  
    let param = {
      'imgBase64': img
    }
    return this.http.post(`${this.url}/insertImage`, param, {headers: headers});
  }


  /**
   * Insertar imagen
   * @param img imagen
   */
  uploadImg(img){
    let headers = new HttpHeaders();
    return this.http.post(`${this.url_cms}/upload`,img, { headers: headers } );
  }


  /**
   * Devolver imágenes 
   */
  getImages(){
    let headers = new HttpHeaders();
    return this.http.get(`${this.url_cms}/pictures`, { headers: headers } );
  }






}
