import { Component, OnInit } from '@angular/core';
import { _HttpClient } from '@delon/theme';
import { NzMessageService } from 'ng-zorro-antd';
import { Router } from '@angular/router';

@Component({
  selector: 'app-inteligencia-regression',
  templateUrl: './regression.component.html',
})
export class InteligenciaRegressionComponent implements OnInit {

  constructor(private http: _HttpClient,private message: NzMessageService,private router:Router) { }
  crmid=1000;
  ingresos=1000000;
  empleados=30;
  CNAE=4649;
  Postal=38002;
  ClientePotencial=1;
  PartnerPotencial=0;
  ClienteActual=0;
  PartnerActual=0;
  Proveedor=0;
  Otro=0;
  FormaLegal1=0;
  FormaLegal2=0;
  FormaLegal3=1;
  FormaLegal4=0;
  FormaLegal5=0;
  
  cluster="ale";

  output="";
  
  predecir(){
    this.output = "";
    const jsondata = {
      "cluster":this.cluster,
      "buyer":"BuyerEmpresa",

      "crmid":this.crmid,
      "ingresos":this.ingresos,
      "empleados":this.empleados,
      "CNAE":this.CNAE,
      "Postal":this.Postal,
      "ClientePotencial":this.ClientePotencial,
      "PartnerPotencial":this.PartnerPotencial,
      "ClienteActual":this.ClienteActual,
      "PartnerActual":this.PartnerActual,
      "Proveedor":this.Proveedor,
      "Otro":this.Otro,
      "FormaLegal1":this.FormaLegal1,
      "FormaLegal2":this.FormaLegal2,
      "FormaLegal3":this.FormaLegal3,
      "FormaLegal4":this.FormaLegal4,
      "FormaLegal5":this.FormaLegal5
    }

    this.http.post('https://demo.curieplatform.com/api/inteligencia/predictcluster',jsondata).subscribe(res=>{
                    // https://demo.curieplatform.com/api/inteligencia/predictcluster
                    // http://localhost:3000/api/inteligencia/predictcluster
      console.log(res);
      this.output=res;
    },err=>{
      console.log("ERROR POST:")
      console.log(err)
    });
  }
  
  
  
  ngOnInit() { }


  cancelar(){
    this.message.create('warning', 'Volviendo');
    this.router.navigateByUrl("/addons/inteligencia");
  }
}
