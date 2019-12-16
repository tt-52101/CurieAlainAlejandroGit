import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { CardviewJson} from './cardview-inteligencia/cardview.class';

@Component({
  selector: 'app-inteligencia',
  templateUrl: './inteligencia.component.html'
})
export class InteligenciaComponent  {

  constructor(private http:HttpClient,private router: Router ) { }

  prueba_post_AI(){
    const json_data:CardviewJson={
      "name":"Manolo",
      "type":"Clustering",
      "time_n":1,
      "time_u":"weeks",
      "first":new Date(),
      "model":"BuyerEmpresa",
      "algorithm":"Kmeans",
      "algorithm_data":{"meh":"data"},
      "status":0
    }
    this.http.post('https://demo.curieplatform.com/api/inteligencia/AI',json_data).subscribe(res=>{
                  // https://demo.curieplatform.com/api/inteligencia/AI
                  // http://localhost:3000/api/inteligencia/AI
      console.log(res);
    },err=>{
      console.log("ERROR POST:")
      console.log(err)
    });
  }

}
