import { Injectable } from '@angular/core';
import { HttpHeaders, HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class TemplatesService {

 
    API_ID = "cdf268cb-8c71-4155-8679-40e458ade559"
    API_KEY = "31a711a7-34bf-44cb-9be6-f7ae420e8ca9"

    constructor(private http: HttpClient) { }

    // request 
    generateImg(data){
        
        
        let headers = new HttpHeaders();  
        headers.append('Content-Type', 'application/json')
        headers.append('Authorization', `Basic ${btoa(`${this.API_ID}:${this.API_KEY}`)}`)
      
       return this.http.post('https://hcti.io/v1/image', data, {headers});
    }
}
