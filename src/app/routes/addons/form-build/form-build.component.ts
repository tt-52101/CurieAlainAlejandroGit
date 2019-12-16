import { Component, OnInit, ViewChild } from '@angular/core';
import { FullContentService } from '@delon/abc';
import { AbstractControl, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { NzMessageService } from 'ng-zorro-antd';
import { SFSchema, SFUISchemaItem, SFComponent } from '@delon/form';
import { Types } from './types-field'
import { CdkDragDrop, moveItemInArray} from '@angular/cdk/drag-drop';
import { CrmService } from '@core/services/crm.service';
import { Modules } from '@shared/utils/modules.enum';
import { ActivatedRoute} from '@angular/router';
import { map ,delay} from 'rxjs/operators';
import { of } from 'rxjs';

@Component({
  selector: 'app-form-build',
  templateUrl: './form-build.component.html',
  styleUrls: ['./form-build.component.less']
})
export class FormBuildComponent implements OnInit {
  
  @ViewChild("propertiesForm") propertiesForm: SFComponent
  @ViewChild('sf') sf:SFComponent; // Objeto dynamic forms

  listOfControl: Array<{ id: number; properties: object }> = [];
  title = 'Título del formulario'
  descricpion = 'Descripción del formulario'
  categoria = "categoria"
  typesField = Types
  token = ''
  modulos = []
  showPanelLeft = true
  showPanel = true
  fieldNow = '' // campo actual
  typeNow = ''  // tipo actual
  schemaNow  // esquema actual
  tipoRespuesta = '' // comprobración para el evento salir del drawer
  idField           // id del campo añadido o seleccionado
  moveTabLeft = 0;
  showProperties = false
  schema: SFSchema = { // Esquema principal (configuración)
    properties: {
      title: {
        type: 'string',
        title: 'Título',
        default: this.title,
        ui: {
          placeholder: 'Escribe un título'
        }
      },
      descripcion: {
        type: 'string',
        title: 'Descripción',
        default: this.descricpion,
        ui: { 
          widget: 'textarea',
          autosize: { minRows: 6, maxRows: 10 },
          placeholder: 'Escribe una descricpión',
        }
      },
      categoria: {
        type: 'string',
        title: 'Categoría',
        default: this.categoria,
        ui: {
          widget: 'select',
          showSearch: true,
        }
      },   
    },
  }



  constructor(
    private full: FullContentService,
    private nzMessageService: NzMessageService,
    private crmService: CrmService,
    private activateRoute: ActivatedRoute
  ){}


  /**
   * ngOnInit se comprueba el item formbuild de localstorage y carga las Api (Módulos)
   */
   async ngOnInit() {
    this.full.toggle();
    this.schemaNow = {
      "properties": {},
      "required": []
    };
    
    this.activateRoute.queryParams.subscribe(params => {
      this.token = params['token']
    });
    await this.crmService.getLists(Modules.modulos).subscribe( (data:any) => {
     this.modulos = data
    });
    if(localStorage.getItem('formbuild') === '' || localStorage.getItem('formbuild') === null){
      console.log('modo creación')     
    }else{
      console.log('modo edición')
    }
  }

 
 
  /**
  * titulo & descripción - categoria
  * @param e evento
  */
  changeTitleDescripcion(event){
    this.title = event.title
    this.descricpion = event.descripcion
    this.categoria = event.categoria
  }

  /**
  * Ir a la configuración del titulo-descripción-categoria
  */
  goTitleDescripcion(){
    this.moveTabLeft = 0;
  }


  /**
  * Button crear encuesta (pasar a preguntas)
  */
 crearEncuesta(){
  this.moveTabLeft = 1;
}



  /**
   * Añadir Pregunta
   * @param e evento
   */
  addField(e?: MouseEvent) {
    this.moveTabLeft = 1;
    this.showProperties = false
    this.tipoRespuesta = ''

    if (e) { 
       e.preventDefault();
    }
    const id = this.listOfControl.length > 0 ? this.listOfControl[this.listOfControl.length - 1].id + 1 : 0;
    const control = {
      id,
      properties: {
        name: 'Elige el tipo de respuesta a tu pregunta'
      },
    };
    const index = this.listOfControl.push(control);
    this.idField = id;
    console.log(this.listOfControl[this.listOfControl.length - 1]); // ultimo elemento creado
  }


  /**
   * Eliminar Pregunta
   * @param e evento
   */
  removeField(i: { id: number; properties: object }, e: MouseEvent): void {
    e.preventDefault();
    if (this.listOfControl.length > 1) {
      const index = this.listOfControl.indexOf(i);
      this.listOfControl.splice(index, 1);
      console.log(this.listOfControl);
    } 
  }



  /** 
  *  Elegir el tipo de campo
  *  @param campo campo
  *  @param index indice del campo
  */
  chooseField(campo,index){
    this.fieldNow = index;
    this.moveTabLeft = 2;
  }

  
  /** 
  *  Mover campos (DRAG & DROP)
  *  @param event para draggear
  */
  drop(event: CdkDragDrop<string[]>) {
    moveItemInArray(this.listOfControl, event.previousIndex, event.currentIndex);
  }




  /** 
  * Evento Tipo de Respuesta
  * @param tipo tipo de campo
  */
  chooseType(tipo){
    this.tipoRespuesta = tipo.campo
    this.moveTabLeft = 2;
    this.showProperties = true
    
    this.typesField.forEach(res => { // recorre todos los tipos 
      if(res.campo === tipo.campo){
        this.typeNow = tipo.campo
        this.schemaNow.properties = res.properties
         // añadir type de campo a la pregunta(id)
        this.listOfControl[this.idField].properties = {
          type: tipo.campo,
          name: res.properties.name['value'],
          required: res.properties.required['value'],
          placeholder: res.properties.placeholder['value'],
          descripcion: res.properties.descripcion['value']
        }
        console.log(this.listOfControl[this.idField]) 
      }
    })

    this.propertiesForm.refreshSchema();

    console.log('Tipo Actual --> ', this.typeNow)
    console.log('Schema Actual --> ', this.schemaNow)
  }


  updateField(event){
    console.log('update -->', event)
    this.listOfControl[this.idField].properties['name']= event.name
    this.listOfControl[this.idField].properties['required']= event.required
    this.listOfControl[this.idField].properties['placeholder']= event.placeholder
    this.listOfControl[this.idField].properties['descripcion']= event.descripcion
  }







  





  /**
   * Abre o cierra el Panel Izquierdo
   * @param accion abrir o cerrar
   */
  panelForm(accion){
    if(accion === 'close'){
      this.showPanelLeft = false
      this.showPanel = false
     }else if(accion === 'open'){
       this.showPanel = true
       this.showPanelLeft = true
     }
  }




  /**
   * Cancelar borrar todos los campos del formulario
   */
  cancelTrash() {
    this.nzMessageService.info('cancel');
  }

  /**
   * Confirmar la eliminación de todos los campos del formulario
   */
  confirmTrash() {
    this.listOfControl.length = 0;
    this.nzMessageService.info('formulario borrado');
  }


  /**
   * GUARDAR FORMULARIO
   * @param type tipo de mensaje
   */
  createMessage(type: string) {
    this.nzMessageService.create(type, `Cambios guardados correctamente`);
  }


}
