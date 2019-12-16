import { Component, OnInit, ViewChild} from '@angular/core';
import { _HttpClient, ModalHelper } from '@delon/theme';
import { STColumn, STComponent, STChange } from '@delon/abc';
import { InteligenciaCurdviewEditComponent } from './edit/edit.component';
import { data } from './data';
import { InteligenciaCurdviewViewComponent } from './view/view.component';
import { deepCopy } from '@delon/util';


@Component({
  selector: 'app-inteligencia-curdview',
  templateUrl: './curdview.component.html',
})
export class InteligenciaCurdviewComponent implements OnInit {
  /**Datos de la tabla */
  data=data;
  /**Referencia a la tabla */
  @ViewChild('st') st: STComponent;
  /**Nombre de referencia para poder implementar la búsqueda */
  custom=[]
  /**Columnas de la tabla */
  columns: STColumn[]
  /**Inputs de la tabla */
  searchInput=[];
  /**Copia de los datos para resetear tabla */
  data_copy = this.data;
  /**Contiene una key por cada columna, cuyo valor será el valor del input, no se hace con columns por si hay columnas que no permitan búsqueda */
  searchStructure={}
  /**Contiene una key por cada columna, cuyo valor será el tipo de dato, no se hace con columns por si hay columnas que no permitan búsqueda */
  searchType={}
  /**@ignore */
  constructor(private http: _HttpClient, private modal: ModalHelper) { }
  /**Inicializa los nombres de las columnas a buscar y las columnas en sí */
  ngOnInit() { 
    /**Nombres "aleatorios", no importan lo más mínimo siempre y cuando sean diferentes */
    this.custom=['custom1','custom2']
    /**Inicializar Columnas con valores, se hace aquí porque debe leer el array this.custom */
    this.columns= [
      { title: '',          index:'checked',    type: 'checkbox'},
      { title: 'Pregunta',  index: 'pregunta',  renderTitle:this.custom[0],sort:{compare:(a: any, b: any) => ('' + a.pregunta).localeCompare(b.pregunta),},},
      { title: 'Respuesta', index: 'respuesta', type: 'number', renderTitle:this.custom[1] },
      { title: '',
        buttons: [
          { text: 'Ver', click: (item: any) => this.view(item) },
          { text: 'Editar', type: 'static',  click: (item: any) => this.edit(item) },
        ]
      }
    ];
    /**Inicializar Inputs a vacío ('') solo en los que tengan la propiedad renderTitle */
    for(let i in this.columns) if(this.columns[i].hasOwnProperty('renderTitle'))this.searchInput.push('')
  }
  /**Devuelve la columna si tiene el search activo y corresponde al índice */
  findcolumn(c){
    const custom_ = this.custom[c]
    for(let i in this.columns)if(this.columns[i].hasOwnProperty('renderTitle'))if(this.columns[i]['renderTitle']===custom_) return this.columns[i]
  }
  /**Carga los valores de los inputs en la key correspondiente */
  powerSearch(c){
    this.changeFill(c);
    const column_ = this.findcolumn(c);
    this.searchStructure[`${column_.index}`]=this.searchInput[c];
    if(column_.type === undefined){
      this.searchType[`${column_.index}`]='string';
    }else this.searchType[`${column_.index}`]=column_.type;
    this.fullPowerSearch()
  }
  /**Resetea un input en concreto, y realiza la búsqueda con los demás criterios */
  powerResetSearch(c):void{
    const column_ = this.findcolumn(c);
    const colname = column_.index
    this.searchStructure[`${colname}`]='';
    this.searchInput[c]='';
    this.changeFill(c);
    this.fullPowerSearch();
  }
  /**Resetea todos los inputs, y resetea la tabla */
  fullPowerResetSearch(){
    for(let i in this.searchStructure) this.searchStructure[i]='';
    for(let i in this.searchInput) this.searchInput[i]='';
    this.data = this.data_copy;
    for(let i in document.getElementsByClassName('icon_search_fill')) this.changeFill(i)
  }
  /**Realiza una búsqueda con todos los criterios activos
   * 
   * String y number actuan igual, el resto de tipos de datos hay que implementarlos
   */
  fullPowerSearch(){
    this.data = this.data_copy;
    const keys = Object.keys(this.searchStructure)
    for(let i in keys){
      switch(this.searchType[keys[i]]){
        case 'string':
        case 'number':
            this.data = deepCopy(this.data).filter(w => ~w[keys[i]].toString().indexOf(this.searchStructure[keys[i]].toString()));
        break;
        case 'date':
        break;
        case 'no':
        break;
        case 'yu':
        break;
        default:
        break;
      }
    }
  }
  /**Modifica el color del icono para indicar que se está buscando o no */
  changeFill(i){
    if(this.searchInput[i]!=='' && this.searchInput[i]!==undefined )(<HTMLElement>document.getElementById('searchIcon'+String(i)).firstChild).style.fill = '#00A477'
    else (<HTMLElement>document.getElementById('searchIcon'+(i.toString())).firstChild).style.fill = "currentColor"; 
  } 
  /**Crea un modal para añadir un nuevo elemento */
  add() {
     this.modal
       .createStatic(InteligenciaCurdviewEditComponent, { i: { id: 0 } })
       .subscribe(() => this.st.reload());
       this.data_copy = this.data;
  }
  /**Crea un modal para visualizar un elemento */
  view(item:any){
    this.modal
      .createStatic(InteligenciaCurdviewViewComponent, { i: item })
      .subscribe(() => this.st.reload());
  }
  /** Crear un modal para editar un elemento
   * @param item elemento a editar
   */
  edit(item:any){
    this.modal
      .createStatic(InteligenciaCurdviewEditComponent, { i: item, pos:this.find(item) })
      .subscribe(() => this.st.reload());
      this.data_copy = this.data;
  }
  /**Compara las propiedades EN COMÚN de 2 JSON
   *
   * Se presupone que son del mismo tipo
   * 
   * Se leen las propiedades de a, SOLO si b tiene esa propiedad se comprueba si son iguales, en caso de
   * no serlo se devuelve false
   * 
   * Si dos json no comparten propiedades se devolverá true
   */
  compareJSON(a,b):boolean{
    const a_keys = Object.keys(a);
    for( let k in a_keys){
      if( b.hasOwnProperty(a_keys[k]) && (a[a_keys[k]]!== b[a_keys[k]]) ) return false
    }
    return true
  }
  /** Busca un elemento y devuelve su posición */
  find(item:any):number{
    for (let i = 0; i < data.length; i++) {
      if(this.compareJSON(data[i], item)) return i;  
      else{ console.log(JSON.stringify(data[i])); console.log(JSON.stringify( item)) }   
    }
    return -1;
  }
  /**Controla el change de la tabla */
  change(e: STChange) {
    // console.log('change', e);
  }

  
}
