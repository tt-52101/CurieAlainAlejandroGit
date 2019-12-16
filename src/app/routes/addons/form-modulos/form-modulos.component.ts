import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ModulosOldService } from '@core';
import { moveItemInArray, CdkDragDrop, transferArrayItem } from '@angular/cdk/drag-drop';
import { FullContentService, STComponent } from '@delon/abc';
import { NzMessageService } from 'ng-zorro-antd';
import { NzNotificationService } from 'ng-zorro-antd';
import { STColumn, STData, STChange } from '@delon/abc'; // tabla ng-alain

import { element } from '@angular/core/src/render3';
import { NzFormatEmitEvent } from 'ng-zorro-antd';
import { moduleDef } from '@angular/core/src/view';



@Component({
  selector: 'app-form-modulos',
  templateUrl: './form-modulos.component.html',
  styleUrls: ['./form-modulos.component.less']
})
export class FormModulosComponent implements OnInit {
  @ViewChild('st') st: STComponent;
  // DATOS API 
  token: any;             // token
  main_module: any;       // nombre modulo principal
  campos_main: any = [];  // campos modulo principal
  secondary_modules: any = []; // nombre de los modulos secundarios
  campos_sec: any = []; // campos modulo secundarios

  // STEP 1
  name_form: string; // Nombre form
  descripcion: string; // descripcion form
  urlredirect: string; // Redirect Url form
  message_confirm: string;       // Mensaje de confirmación form
  selected_modulo = [];   // Módulos seleccionados form
  validateForm: FormGroup;  // validation form
  pages_fields_edit; // páginas con campos que se van a editar


  // ALMACENAR VALORES MODO EDITAR
  modo_edit; 
  campos_edit = [];
  campos_edit_table = [];
  
  modulos_filtro = []; // modulos seleccionados filtro

  modulos_total = []; // Nombre Modulos Total secundarios
 
  isVisible = false; // boton modal -- step 3(ordenar campos)

  index_ = 0; // inicio página step3 - tab
  list: any = [
    {
      'page' : `Página ${this.index_}`,
      'fields': [ ]
    }
  ];

  // Para cambiar de steps
  current = 0;
  index = 'First-content';

  DisplayData: any;  // DATOS DE LA TABLA
  copia_filtros: any; // Copia para filtros

  campos_select = []; // campos seleccionados TABLA
  campos_checkbox = []; // checkbox TABLA
  campos_end = [];  // campos para el drag&drop --> STEP3

  campos_sec_end = []; // campos secundarios(required)
  required_main = []; // campos required(modulo principal)

  item_actual; // campo actual para mostrar el modal con las propiedades

  modal_date = []; // datos del modal


  /** ---------------------------------------------------
                    CONSTRUCTOR
  ---------------------------------------------------- */
  constructor(private notification: NzNotificationService,private message: NzMessageService,private moduloService: ModulosOldService,private full: FullContentService,private fb: FormBuilder) { }


  /** ---------------------------------------------------
                    TABLA NEW
  ---------------------------------------------------- */
  params = { a: 1, b: 2 };
  columns: STColumn[] = [
    { title: 'Checkbox', index: 'required.value', type: 'checkbox'},
    { title: 'Nombre', index: 'label',},
    { 
      title: 'Módulo',
      index: 'modulo' ,
      filter: {
      menus: this.modulos_filtro,
      confirmText: 'Buscar',
        clearText: 'Cerrar',
      fn: (filter: any, record: any) => record.modulo === filter.value,
      
    },

   },
    { title: 'Obligatorio', 
      index: 'required',
      filter: {
        menus: [
          { text: 'Obligatorio', value: true },
          { text: 'No Obligatorio', value: false },
        ],
        multiple: false,
        confirmText: 'Buscar',
        clearText: 'Cerrar',
        fn: (filter: any, record: any) => record.required === filter.value,
      },
      sort: {
        compare: (a: any, b: any) => a.required - b.required,
      },
  
    },
    { title: 'Propiedades', index: 'Propiedades',
      buttons: [
                  {
                    text: 'Ver',
                    icon: 'eye',
                    type: 'link',
                    click: (e: any) =>  this.showModal(e),

                  } 
      ],
    },
    ];

   /** ---------------------------------------------------
          STEP2 - Guarda el estado del campo (checked)
    ---------------------------------------------------- */
    change(e: STChange) {
    
      if(e.checkbox){
        for(let i = (e.ps * (e.pi - 1)); i < e.ps * e.pi; i++) {
          if(this.DisplayData[i].required !== true){
            this.DisplayData[i].checked = false;
          }  
        }
        e.checkbox.forEach(el => {
          for(let i = 0; i < this.DisplayData.length; i++) {
            if(this.DisplayData[i].id === el.id){
              this.DisplayData[i].checked = el.checked;
            }
          }
        })
      }
    }

    /** --------------------------------------------------------------------------------------------------------------
      STEP2 - cambia el estado a true de los campos obligatorios y no permite cambiarlos de estados a checked = false
    ----------------------------------------------------------------------------------------------------------------- */
    dataProcess(data: STData[]) {
      return data.map((i: STData) => {
        if(i.required === true ){
          i.disabled = i.required === true;
          i.checked = true;
        }
        return i;
      });
    }


    /** ---------------------------------------------------
                      INIT(ngOnInit)
    ---------------------------------------------------- */
    ngOnInit() {
      this.full.toggle();
    
      // si el FORM(Marcos) está vació  o no existe item --> CREAR FORMULARIO desde cero
      if(localStorage.getItem('Form') == '' || localStorage.getItem('Form') === null){
        this.moduloService.get_token().subscribe( (data: any) => {
          this.token = data.result.token;  // coge el token
          this.mostrarCamposModulos();  // coge los modulos con los campos
          }, error => {
              console.log(error);
        });
        localStorage.setItem('dataform', ''); // creo el item donde va a coger los datos
        
      }else{ // MODO EDITAR FORMULARIO
    
        // obtengo los datos y almacenar en la variables correspondientes 
        this.modo_edit = localStorage.getItem('Form');
        let format =  JSON.parse(this.modo_edit);

        this.name_form = format[0].nameForm;
        this.descripcion = format[0].descripcion;
        this.urlredirect = format[0].url_redirect;
        this.message_confirm = format[0].message_confirm;
        this.main_module = format[0].main_module;  
        format[0].sec_modules.forEach(mod => {
          this.selected_modulo.push(mod)
        })
        this.pages_fields_edit = format[0].pages;
        // coger campos de las páginas
        format[0].pages.forEach(pag => {
          pag.fields.forEach( field => {
            this.campos_edit.push(field);
          })
        })

        console.log('format[0].pages', format[0].pages);

        console.log('campos edición --> ' , this.campos_edit);
        this.moduloService.get_token().subscribe( (data: any) => {
          this.token = data.result.token;  
          this.mostrarCamposModulos(); 
          }, error => {
              console.log(error);
        });

        localStorage.setItem('dataform', ''); // creo el item donde va a coger los datos
      }

      // validacion del formulario
      this.validateForm = this.fb.group({
        name_form: [null, [Validators.required]],
        selected_modulo: [null, [Validators.required]]
      });
    }

    /** ------------------------------------------------
              MOSTRAR MODULOS/CAMPOS (API)
    ---------------------------------------------------- */
    mostrarCamposModulos() {
    
          const modulo_api = 'Contacts';
          let modulos = this.moduloService.getModulosCampos(modulo_api, this.token).subscribe( (dat: any) => {

          const v = Object.values(dat.result);
          
          // MODULO PRINCIPAL
          this.main_module = v[1]; // name
          const data_main = v[0][this.main_module]['fields']; // campos
          
          for (const key in data_main) {
            if (data_main[key]['options'] != null){

                this.campos_main.push({
                  id: data_main[key]['id'],
                  modulo: this.main_module,
                  name: data_main[key]['name'],
                  required: data_main[key]['required'],
                  label: data_main[key]['label'],
                  type: data_main[key]['type'],
                  options: Object.values(data_main[key]['options'])
                });

            }else{

              this.campos_main.push({
                id: data_main[key]['id'],
                modulo: this.main_module,
                name: data_main[key]['name'],
                required: data_main[key]['required'],
                label: data_main[key]['label'],
                type: data_main[key]['type'],
                options: data_main[key]['options']
              });
            }
          }
          
          this.DisplayData = [...this.campos_main];
          
          // MODULO SECUNDARIOS
          const sec = v[2]; // name
          for (const key in sec) {  // ALMACENA NOMBRE DE LOS MODULOS SECUNDARIOS
            this.modulos_total.push(sec[key]);
              this.secondary_modules.push({
                name: sec[key],
                type: "secondary",
                checked: false,
              });
          }

          for (const i in this.secondary_modules) {

              const nombre = this.secondary_modules[i]['name']; // name modulo secundario
          
              if(v[0][nombre].type !== 'main'){
                const data_sec = v[0][nombre].fields;    // CAMPOS DEL MODULO
                for (const key in data_sec) {
                  if (data_sec[key]['options'] != null){
        
                      this.campos_sec.push({
                        id: data_sec[key]['id'],
                        modulo: nombre,
                        name: data_sec[key]['name'],
                        required: data_sec[key]['required'],
                        label: data_sec[key]['label'],
                        type: data_sec[key]['type'],
                        options: Object.values(data_sec[key]['options'])
                      });
        
                  }else{
        
                    this.campos_sec.push({
                      id: data_sec[key]['id'],
                      modulo: nombre ,
                      name: data_sec[key]['name'],
                      required: data_sec[key]['required'],
                      label: data_sec[key]['label'],
                      type: data_sec[key]['type'],
                      options: data_sec[key]['options']
                    });
                  }
                }
              }
          }
          },
          err => {
            console.log(err);
          });
      
    }

  

    
    /** ---------------------------------------------------
                   Función del botón EMPEZAR
    ---------------------------------------------------- */
    empezar(): void {
    
      // validacion FORM
      for (const i in this.validateForm.controls) {  
        this.validateForm.controls[i].markAsDirty();
        this.validateForm.controls[i].updateValueAndValidity();
      }
      
      // Controla la inserción del campo obligatorio(name_form)
      if(this.name_form !== undefined && this.name_form !== ''){
        this.current += 1;
        this.changeStep();
      }else{ 
        this.notification.create(
          'error',
          'Campos Obligatorios',
          'Falta por rellenar campos obligatorios. Por favor, rellene los campos obligatorios.'
        );
      }

      // filtro modulo principal + secundarios
      this.modulos_filtro.push({ 
        text: this.main_module,
        value: this.main_module
      });
      this.selected_modulo.forEach(mod_sec => {
        this.modulos_filtro.push({
          text: mod_sec,
          value: mod_sec
        })
      });
    
      // modulos en total seleccionados + main_module
      let mode = [];
      mode.push(this.main_module)
      this.selected_modulo.forEach(m =>{
        mode.push(m);
      })

      // campos que quieres editar en la tabla
      this.campos_edit.forEach(campo => {
            mode.forEach(mod =>{
          if(campo.modulo === mod){
            this.campos_edit_table.push(campo);
          }
        });
      })

      var dat: any = [];
      for ( const key in this.campos_sec) {
        this.selected_modulo.forEach(mod => {
          if ( this.campos_sec[key].modulo === mod ) {
            dat.push(this.campos_sec[key]);
          }
        });  
      }
      let result: any = [];
      result = [...this.campos_main, ...dat];
      this.DisplayData = result;
      this.copia_filtros = this.DisplayData;    // copia para filtros
      this.newProcess(this.DisplayData);
    }
    

    /** ---------------------------------------------------
                   Función checked a MANO
    ---------------------------------------------------- */
    newProcess(data: STData[]) {

      return data.map((i: STData) => {
        if(i.required === true){
          i.disabled = i.required === true;
          i.checked = true;
        }else{
          i.checked = false;
        }
  
        // campos edit
        this.campos_edit_table.forEach(campo => {
          if(campo.id == i.id){
            i.checked = true;
          }
        });
        return i;
      });
    }

    /** ---------------------------------------------------
              Función botón siguiente STEP 2
    ---------------------------------------------------- */
    next(): void {
       this.DisplayData.forEach(ele => { // coger valores tabla checked == true
         if(ele.checked == true){
           this.campos_end.push(ele);
         }
       })

      // crear numero de páginas
      for(let i = 1; i<this.pages_fields_edit.length; i++){
        this.list.push({page: this.pages_fields_edit[i].page ,fields: []});
      }

      // rellenar campos en las paginas
      for(let i = 0; i<this.pages_fields_edit.length; i++){
          this.pages_fields_edit[i].fields.forEach(field=>{ // campos
              this.campos_end.forEach((field2,ind) =>{
                if(field.id === field2.id) {
              
                  this.list[i].fields.push(field);
                  this.campos_end.splice(ind,1);
                }
              })
          }) 
      }
      this.current += 1; // siguiente página
      this.changeStep();
    }


   /** ---------------------------------------------------
                   Función del botón GUARDAR
    ---------------------------------------------------- */
    saveForm(): void {
      this.notification.create(
        'success',
        'Formulario Guardado',
        'El formulario ha sido guardado correctamente.'
      );
      
      let datito = [];

      datito.push({
        nameForm: this.name_form,
        descripcion: this.descripcion,
        url_redirect: this.urlredirect,
        message_confirm: this.message_confirm,
        main_module: this.main_module,
        sec_modules: this.selected_modulo,
        pages: this.list
      });

      let end =  JSON.stringify(datito);
      localStorage.setItem('dataform', end);
    }

 
    /** ---------------------------------------------------
                    Función abrir Modal
    ---------------------------------------------------- */
    showModal(i){
      this.modal_date.push({
        name: i['name'],
        modulo: i['modulo'],
        type: i['type'],
        options: i['options'],
        label: i['label'],
        required: i['required']
      });
      this.item_actual = i.name;
      this.isVisible = true;
    }

    /** ---------------------------------------------------
                    Función cerrar Modal
    ---------------------------------------------------- */
    closeModal(){
      this.isVisible = false;
      this.item_actual = '';
      this.modal_date = [];
    }


    /** ---------------------------------------------------
              Función cambiar de STEP
    ---------------------------------------------------- */
    changeStep(): void {
      switch (this.current) {
        case 0: {
          this.index = 'First-content';
          break;
        }
        case 1: {
          this.index = 'Second-content';
          break;
        }
        case 2: {
          this.index = 'third-content';
          break;
        }
        default: {
          this.index = 'error';
        }
      }
    }


    /** ---------------------------------------------------
              Función del botón Atrás STEP2
    ---------------------------------------------------- */
    back(): void {
      this.modulos_filtro = [];
     // this.selected_modulo = [];
      
      this.campos_select = [];
      this.campos_end = []; // campos del drag&drop
     
      this.current -= 1; // volver atrás
      this.changeStep();
      
    }
    cancel(): void {
      this.message.info('Cancelar');
    }
    confirm(): void {
      this.message.info('Ok');
      this.back();
    }

    /** ---------------------------------------------------
              Función del botón Atrás STEP3
    ---------------------------------------------------- */
    back_(): void {
      this.current -= 1; // volver atrás
      this.changeStep();
      this.campos_end = [];
    
      this.list.forEach( element => {
        element.fields.forEach(dat =>{
          this.campos_select.push(dat);
        });
      });

      this.list = [
        {
          'page' : `Página ${this.index_}`,
          'fields': [ ]
        }
      ];
    }

    cancel_(): void {
      this.message.info('Cancelar');
    }
    confirm_(): void {
      this.message.info('Ok');
      this.back_();
    }
    cancel_page(): void{
      this.message.info('Página No eliminada');
    }
  

    

     /** ---------------------------------------------------
                  Función Drag and Drop
    ---------------------------------------------------- */
    drop(event: CdkDragDrop<any[]>) {
      if (event.previousContainer === event.container) {
        moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
      } else {
        transferArrayItem(event.previousContainer.data,event.container.data,event.previousIndex,event.currentIndex);
      }
    }
  
      tabs = ['Página 2'];
  
      /** ---------------------------------------------------
            Función encargada de eliminar una página
      ---------------------------------------------------- */
      closeTab(tab: string): void {
       for(let i=0; i < tab['fields'].length ; i++){
        this.campos_end.push(tab['fields'][i]);
       }
        this.list.splice(this.tabs.indexOf(tab), 1);
        this.message.info('Página eliminada');
      }
  
  
      /** ---------------------------------------------------
            Función encargada de añadir una página
      ---------------------------------------------------- */
      newTab(): void {
       
        this.index_ = this.list.length;
        this.list.push({page: `Página ${this.index_}` ,fields: []});
      }

  

}
