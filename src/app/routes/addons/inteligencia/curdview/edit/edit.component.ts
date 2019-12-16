import { Component, OnInit, ViewChild, EventEmitter, Output } from '@angular/core';
import { NzModalRef, NzMessageService } from 'ng-zorro-antd';
import { _HttpClient } from '@delon/theme';
import { SFSchema, SFUISchema } from '@delon/form';
import { data, index_ } from '../data';

@Component({
  selector: 'app-inteligencia-curdview-edit',
  templateUrl: './edit.component.html',
})
export class InteligenciaCurdviewEditComponent implements OnInit {
  record: any = {};
  i: any;
  pos = -1;
  last;
  schema: SFSchema = {
    properties: {
      pregunta: { type: 'string', title: 'Pregunta' },
      respuesta: {  type: 'number', 
                    title: 'Número', 
                    minimum: 0,
                    maximum: 10000,
                    multipleOf:2,
                    default:10 
      }
    },
    required: ['pregunta', 'respuesta'],
  };
  ui: SFUISchema = {
    '*': {
      spanLabelFixed: 100,
      grid: { span: 12 },
    },
    $pregunta: {
      widget: 'string'
    },
    $respuesta: {
      widget: 'number'
    },
  };

  constructor(
    private modal: NzModalRef,
    private msgSrv: NzMessageService,
    public http: _HttpClient,
  ) {}

  ngOnInit(): void {
    // if (this.record.id > 0)
    // this.http.get(`/user/${this.record.id}`).subscribe(res => (this.i = res));
    console.log(this.pos)
    if(this.pos !== -1) this.last = data[this.pos]
  }

  /** Se generan dos arrays del mismo tamaño, uno solo con 0s y el otro con 0s o 1s
   *  dependiendo si son iguales o no los valores, si estos arrays al final son iguales significa que la clave ya existe 
   * 
   * true = no existe en la BD
   * false = existe en la bd
   * */
  checkKey(value){
    for(let i in data){
      if(Number(i) !== this.pos){
        let check=[];
        let allEqual0=[];
        for(let j in index_){
          if(data[i][`${index_[j]}`] === value[`${index_[j]}`]) {check.push(0); console.log(data[i][`${index_[j]}`]);  console.log(value[`${index_[j]}`])  }
          else check.push(1);
          allEqual0.push(0);
        }
        if(JSON.stringify(allEqual0) === JSON.stringify(check)) {console.log(JSON.stringify(check)); console.log(JSON.stringify(allEqual0));return false};
      }
    }
    return true;
  }

  /** Guarda el nuevo o editado elemento en la bd si cumple con la comprobación de clave */
  save(value: any) {
    let mss='Insertado';
    
    if(this.checkKey(value)){
      if(this.pos !== -1) {
      data[this.pos]=value; mss='Modificado';
      }
      else {value['checked']=false;data.push(value);}
      this.msgSrv.success(mss);
      this.modal.close(true);
    }
    else{
      mss='El elemento ya existe';
      this.msgSrv.error(mss); 
    }
  }

  /**Cierra el modal */
  close() {
    this.modal.destroy();
  }
}
