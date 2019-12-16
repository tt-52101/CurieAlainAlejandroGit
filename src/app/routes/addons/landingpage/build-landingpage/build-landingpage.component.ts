import { Component, OnInit } from '@angular/core';
import { Router , ActivatedRoute} from '@angular/router';
import { CmsService } from '@core/services/cms.service';
import { FullContentService } from '@delon/abc';
import { Estructuras, Elementos, translate  } from './elementos'
import { map } from 'rxjs/operators';

declare var grapesjs: any; // IMPORTANT
declare var CKEDITOR: any;
let copia_editor; // Para trabajar con la funcióng o_back()

const elemRemove = ['sect100','sect50','sect30','sect37','divider','text-sect','grid-items','list-items','image','text','quote','link','link-block','button']

@Component({
  selector: 'app-build-landingpage',
  templateUrl: './build-landingpage.component.html'
})
export class BuildLandingpageComponent implements OnInit {
  
   token = ''
   imgGhost:any

  /**
   constructor Metodo para inicializar recursos
   * @param {Router} router atributo para el manejo de rutas
   * @param falta explicar el resto de params
   */
  constructor(
    private router: Router,
    private full: FullContentService,
    private cmsservice: CmsService,
    private activateRoute: ActivatedRoute,
  ){}


  /**
   Metodo que carga el contenido del item landingpage en el canvas
   */
  get_crm_edit() {
    const value = localStorage.getItem('landingpage');
    document.getElementById('gjs').innerHTML = value;
  }



  /**
   Metodo que crea el item landingpage y lo carga vacío en el canvas
   */
  get_crm_new() {
    localStorage.setItem('landingpage', '');
    document.getElementById('gjs').innerHTML = ''; 
  }

  /**
   Metodo que devuelve imágenes almacenadas en Ghost CMS
   */
  async getImgs(editor) {
    let aux = await this.cmsservice.getImages().pipe(
      map(res => res['data'])
    ).toPromise()
    editor.AssetManager.add(aux)
    editor.AssetManager.render()
    console.log('aux -->', aux)
    return aux 
  }


  
  /**
   ngOnInit
   */
  ngOnInit() {
    this.full.toggle();
    let router_ = this.router;
    let editor = null;
   

    this.activateRoute.queryParams.subscribe(params => {
  
        /**
         Comprueba si existe el item landingpage,
        */
        if (localStorage.getItem('landingpage') === '') {
          this.get_crm_new();
        } else {
          this.get_crm_edit();
        }

      
        /**
         Inicializar el editor (provisional)
        */
         editor = grapesjs.init({
          container: '#gjs', 
          fromElement: true, 
          storageManager: {
            id: 'gjs-', 
            type: 'local', 
            autosave: true, 
            autoload: false, 
            storeComponents: true, 
          },
          height: '100%',
          width: '100%',
          canvas: {
            styles: ['https://use.fontawesome.com/releases/v5.5.0/css/all.css'],
          },
           avoidInlineStyle: 1,
          assetManager: {
            assets: [],
            autoAdd: 1,
            uploadFile: false,
            uploadText: 'Subir foto',
            addBtnText: 'Agregar URL'
          },
          layerManager: {
            appendTo: '#layers-container',
          },
          blockManager: {
            appendTo: '#blocks',
            },
          traitManager: {
            appendTo: '#traits-container',
          },
          styleManager: {
            appendTo: '#styles-container',
          },
          panels: {
            defaults: [
              {
                id: 'layers',
                el: '#layers',
                resizable: {
                  minDim: 275,
                  maxDim: 350,
                  tc: 0,
                  cr: 0,
                  cl: 1,
                  bc: 0,
                  keyWidth: 'flex-basis',
                },
              },
              {
                id: 'styles',
                el: '#panel_left',
                resizable: {
                  minDim: 408,
                  maxDim: 700,
                  tc: 0,
                  cr: 1,
                  bc: 0,
                  keyWidth: 'flex-basis',
                },
              },
              {
                id: 'button_styles',
                el: '#button_styles',
              },
              {
                id: 'title_styles',
                el: '#title_styles',
                buttons:[
                  {
                    id: 'show-style',
                    active: false,
                    label: '<div id="show-style"> <img src="../../assets/icon/estilos1.svg" alt="Estilos" height="14px" width="14px" style="margin-right: 8px;">Estilos</div>',
                    command: 'show-style',
                    togglable: false,
                  },
                ],
              },
              {
                id: 'botones',
                el: '#botones',
                buttons: [
                  {
                    id: 'open-structure',
                    active: true,
                    label: '<div id="open-structure"> <img src="../../assets/icon/estructura1.svg" alt="Capas" height="14px" width="14px" style="margin-right: 8px;">Estructura</div>',
                   command: 'open-structure'
                  },
                  {
                    id: 'open-blocks',
                    active: false,
                    label: '<div id="open-blocks"> <img src="../../assets/icon/elementos1.svg" alt="Capas" height="14px" width="14px" style="margin-right: 8px;">Elementos</div>',
                   command: 'open-blocks',
                  },
                ],
              },
              {
                id: 'panel-top',
                el: '.panel__top',
              },
              {
                id: 'basic-actions',
                el: '.panel__basic-actions',
                buttons: [
                  {
                    id: 'template',
                    command: {
                      run: function() {
                        router_.navigateByUrl(`/addons/landingpage?token=${params['token']}`);
                        localStorage.setItem('landingpage', '');
                      },
                    },
                    label: '<i class="fas fa-brush"></i>',
                    attributes: { 
                      'title': 'Templates',
                      'data-tooltip-pos': 'bottom',
                      'data-tooltip': 'Ver plantillas',
                     },
                    active: false,
                  },
                  {
                    id: 'visibility',
                    active: true,
                     className: 'visibility',
                    command: 'sw-visibility',
                  },
                  {
                    id: 'preview',
                    command: 'preview',
                    className: 'fa fa-eye',
                    attributes: { 'title': 'Preview', 'data-tooltip-pos': 'bottom','data-tooltip': 'Vista Previa'},  
                    active: false,
                  },
                  {
                    id: 'undo',
                    active: false,
                    className: 'fas fa-undo-alt',
                    command: 'undo',
                    attributes: { 'title': 'Atrás', 'data-tooltip-pos': 'bottom','data-tooltip': 'Deshacer' },
                  },
                  {
                    id: 'redo',
                    active: false,
                    className: 'fas fa-redo-alt',
                    command: 'redo',
                    attributes: { 'title': 'Rehacer', 'data-tooltip-pos': 'bottom', 'data-tooltip': 'Rehacer' },
                  },
                  {
                    id: 'trash',
                    className: 'fas fa-trash',
                    command: 'clear-canvas',
                    attributes: { 'title': 'Papelera', 'data-tooltip-pos': 'bottom', 'data-tooltip': 'Borrar'},    
                    active: false,
                  },
                  {
                    id: 'exit',
                    className: 'fas fa-door-open',
                    command: 'exit',
                    attributes: { 'title': 'Salir', 'data-tooltip-pos': 'bottom', 'data-tooltip': 'Ir al CRM'},    
                    active: false,
                  },
                ],
              },
            ]
          },
    
          plugins: ['gjs-preset-newsletter','gjs-plugin-ckeditor' ],
          pluginsOpts: {
            'gjs-plugin-ckeditor': {
              position: 'center',
              options: {
              skin: 'moono-dark',
              startupFocus: true,
              extraAllowedContent: '*(*);*{*}',
              allowedContent: true,
              language: 'es',
              enterMode: CKEDITOR.ENTER_BR,
              extraPlugins: 'sharedspace,justify,colorbutton,panelbutton,font',
              toolbar: [
                { name: 'styles', items: ['Font', 'FontSize' ] },
                ['Bold', 'Italic', 'Underline', 'Strike'],
                { name: 'paragraph', items : [ 'NumberedList', 'BulletedList'] },
                { name: 'justify', groups: [ 'blocks', 'align' ], items: [ 'JustifyLeft', 'JustifyCenter', 'JustifyRight', 'JustifyBlock' ] },
                { name: 'links', items: ['Link', 'Unlink'] },
                { name: 'colors', items: [ 'TextColor', 'BGColor' ] },
                { name: 'editing',     groups: [ 'find', 'selection', 'spellchecker' ] },
                { name: 'about'},
                { name: 'others'}
              ]
             }
            },
    
          },
        });

        this.imgGhost = this.getImgs(editor);
    
        copia_editor = editor;
        editor.DomComponents.getWrapper().set('style', { 
          'outline': 'none !important',
          'padding-bottom': '10% !important' 
        });
        this.closePanel('right')
        
  
 
    /** ----------------------------------------
        Inicio si el item landingpage está vacío
    --------------------------------------------- */
    if(localStorage.getItem('landingpage') === '' ){
      editor.DomComponents.getWrapper().set('style',{ 
        'background-color': 'white',
        'background-image': "url('./../assets/landingpage/images/Arrastraestructura.svg')",
        'background-repeat' : 'no-repeat',
        'background-position' : 'center',
        'background-size' : '30%',
      });
    }


    /** ------------------------------------------
          PREVISUALIZAR (Abrir y cerrar paneles)
    ----------------------------------------------- */
    editor.on('run:preview', () => {
      this.closePanel('left')
      this.closePanel('right')
    });
    editor.on('stop:preview', () => {
      this.openPanel('left')
      this.openPanel('right')
    });

    /** -------------------------------
               FUNCIÓN PAPELERA
    ---------------------------------- */
    editor.Commands.add('clear-canvas',{
      run: () => {
        if (confirm('Are you sure to clean the canvas?')) {
          editor.DomComponents.clear();
          editor.UndoManager.clear(); 
          editor.CssComposer.clear(); 
          editor.DomComponents.getWrapper().set('style',{ 
            'background-color': 'white',
            'background-image': "url('./../assets/landingpage/images/Arrastraestructura.svg')",
            'background-repeat' : 'no-repeat',
            'background-position' : 'center',
            'background-size' : '30%',
            'outline': 'none !important',
            'padding-bottom': '10% !important'
          });
          setTimeout(function() {
            localStorage.setItem('landingpage', '');
          }, 0);
        }
      },
     /* stop: () =>  {
        editor.Panels.getButton('basic-actions', 'trash').set('active',false);
      },*/
    });

   
    /** -----------------------------------------------------------
                              ESTRUCTURA 
    --------------------------------------------------------------- */
    editor.Commands.add('open-structure', {
      run: () => {
      document.getElementById('blocks').style.display = '';
        for(let i = 0; i <= 5; i++) {
          editor.BlockManager.add(`${Estructuras[i].name}`, {
            label: Estructuras[i].label,
            content: Estructuras[i].content,          
          });
        }
        for (let i = 0; i <= 11; i++) {
          editor.BlockManager.remove(`elemento${i}`);
        }
      },
      stop() {
      //  document.getElementById('blocks').style.display = 'block';
      },
    });

    /** -------------------------------------------------------
                              ELEMENTOS 
    ----------------------------------------------------------- */
    editor.Commands.add('open-blocks', {
      run() {
        document.getElementById('blocks').style.display = '';
        for(let i = 0; i <= 10; i++) {
          editor.BlockManager.add(`${Elementos[i].name}`, {
            label: Elementos[i].label,
            content: Elementos[i].content,          
          });
        }
        for (let i = 1; i <= 6; i++) {
          editor.BlockManager.remove(`section${i}`);
        }
      },
      stop() {
      //  document.getElementById('blocks').style.display = 'none';
      }
    });




    /** -------------------------
              ESTILOS  
    ----------------------------- */
    editor.Commands.add('show-style', {
      run() {
        document.getElementById('button_styles').style.display = '';
        document.getElementById('button_back').style.display = '';
        document.getElementById('botones').style.display = 'none';
        document.getElementById('title_newsletter').style.display = 'none';
        document.getElementById('blocks').style.display = 'none';
      },
      stop() {
        document.getElementById('button_styles').style.display = 'none';
        document.getElementById('title_newsletter').style.display = '';
        document.getElementById('button_back').style.display = 'none';
        editor.Panels.getButton('title_styles', 'show-style').set('active',false)
      },
    });



    /** -------------------------------------
          Almacenar datos automaticamente
    ----------------------------------------- */
    editor.StorageManager.add('pepito', {
      load: () => {
        document.getElementById('gjs').innerHTML = localStorage.getItem('pepito');
      },
      store: () => {
        localStorage.setItem('landingpage', '<style>' + editor.getCss() + '</style>' + editor.getHtml());   
       // console.log('JSON.stringify(editor.getComponents()) --> ', JSON.stringify(editor.getComponents()))
      },
    });
    editor.StorageManager.setCurrent('pepito');

  


    /** --------------------------------------
         EVENTO INSERTAR EN EL CANVAS (Dragenter)
    ------------------------------------------- */
    editor.on('canvas:dragenter', () => {
      editor.DomComponents.getWrapper().set('style', {
         'outline': 'none !important',
         'padding-bottom': '10% !important'
        });
      if(editor.getWrapper().attributes.components.models.length === 0){
        editor.DomComponents.clear();
        editor.UndoManager.clear(); 
        editor.CssComposer.clear(); 
        editor.getWrapper().wrapper.set('style', { 'background-color': 'white' });
      }
    });
    



    /** --------------------------------------
         EVENTO INSERTAR EN EL CANVAS (DROP)
    ------------------------------------------- */
    editor.on('canvas:drop', () => {
      editor.DomComponents.getWrapper().set('style', {
        'outline': 'none !important',
        'padding-bottom': '10% !important'
       });

      let status
     
      if(editor.Panels.getButton('botones', 'open-structure').attributes.active === true) {   // DE ESTRUCTURA ==> ELEMENTOS
        editor.Panels.getButton('botones', 'open-structure').set('active',false); 
        editor.Panels.getButton('botones', 'open-blocks').set('active', true);   
        status = 1 
      }
      
      if (editor.Panels.getButton('botones', 'open-blocks').attributes.active === true  && status !== 1) {   // DE ELEMENTOS ==> ESTILOS
        editor.Panels.getButton('title_styles', 'show-style').set('active',true)
        editor.Panels.getButton('botones', 'open-structure').set('active',false);
        editor.Panels.getButton('botones', 'open-blocks').set('active', false);   
        translate();
      } 
    });

  
    /** ------------------------------------------
        EVENTO SELECCIONAR ELEMENTO EN EL CANVAS
    ---------------------------------------------- */
    editor.on('component:selected', (dt, currentComp) => {
      editor.DomComponents.getWrapper().set('style', {
        'outline': 'none !important',
        'padding-bottom': '10% !important'
       });
      editor.Panels.getButton('title_styles', 'show-style').set('active',true);
      editor.Panels.getButton('botones', 'open-structure').set('active',false);
      editor.Panels.getButton('botones', 'open-blocks').set('active', false);
      document.getElementById('blocks').style.display = 'none'
      translate();

      if(dt.attributes.type === 'video'){
        // console.log('es un video --> ', editor.getSelected())
        editor.getSelected().removeTrait('checkbox')
      }
       
      if(dt.attributes.type === 'video' || dt.attributes.type === 'link' || dt.attributes.type === 'input' ||  dt.attributes.type === 'textarea' || dt.attributes.type === 'img'){
        document.getElementById('contenido').style.display = '';
      }else{
        document.getElementById('contenido').style.display = 'none';
      }
    });



    /** -----------------------------
        EVENTO ABRIR MODAL PHOTOS
    --------------------------------- */
    editor.on("run:open-assets", () => {
      document.querySelector('.gjs-mdl-title').innerHTML = `Selecciona una imagen`
    })


   
     /** -----------------------------
            EVENTO SUBIR IMAGEN
    --------------------------------- */
    editor.on("asset:add", () => {
      const all = editor.AssetManager.getAll();
     
      if(!all.models[0].attributes.src.includes("http")){
        const name = all.models[0].attributes.name.split(".")

        console.log(all.models[0].attributes.src)

 
        let send = {
          "name": name[0], // name
          "photo": all.models[0].attributes.src, // url
          "width": all.models[0].attributes.width, // width
          "height": all.models[0].attributes.height // height
        }

           this.cmsservice.uploadImg(send).subscribe( res => {
             console.log(res['url'])
            all.models[0].attributes.src = res['url']
            all.models[0].id = res['url']
          },
          err => {
            console.log(err);
          });

        }
      console.log(all)
    })

   
    
    /** --------------------------------------------
        EVENTO TERMINAR DE SUBIR IMAGEN MODAL PHOTOS
    ------------------------------------------------ */
    editor.on('asset:upload:end', () => {
     document.querySelector(".gjs-am-assets").addEventListener('click', function(){
      editor.Modal.close();
     })
    });


  
    /** --------------------------------------
          Eliminación de ELEMENTOS PLUGINS 
    ------------------------------------------- */
    for(let i=0; i<= elemRemove.length; i++){
      editor.BlockManager.remove(elemRemove[i])
    }
   
  
  
    /** ----------------------------------------
        Configuración de parámetros de CKEDITOR
    -------------------------------------------- */
    CKEDITOR.dtd.$editable.span = 1; 
    CKEDITOR.dtd.$editable.button = 1; 
    CKEDITOR.dtd.$editable.a = 1; 
    CKEDITOR.dtd.$editable.strong = 1; 
    CKEDITOR.dtd.$editable.li = 1; 
    CKEDITOR.dtd.$editable.p = 1; 




  /*
  * Modo red social
  */
    editor.DomComponents.addType('img', {
      isComponent: el => el.tagName == 'IMG',
      model: {
        defaults: {
          draggable: true,
        stylable: [
          'text-decoration', 'align', 'font-family', 'font-size', 'line-height',
          'padding', 'padding-top', 'padding-left', 'padding-right', 'padding-bottom',
          'border-radius', 'border-top-left-radius', 'border-top-right-radius', 'border-bottom-left-radius', 'border-bottom-right-radius',
          'background-color',
          'color',
        ],
        'style-default': {
          'align': 'center',
          'icon-size': '20px',
          'font-size': '13px',
          'line-height': '22px',
        },
          traits: [
            {
              type: 'href-next',
              name: 'href',
              label: 'Enlace',
              placeholder: 'www.instagram.com'
            },
            
            {
              type: 'select', 
              label: 'Icono',
              name: 'src', 
              options: [
              //  { value: '', name: 'Custom' },
                {  name: 'Facebook', value:'https://i.pinimg.com/originals/ef/b5/d9/efb5d90eeb07bb5914f094007da4c2f7.png' },
                {  name: 'Twitter', value:'https://cdn2.iconfinder.com/data/icons/metro-uinvert-dock/256/Twitter_NEW.png' },
                {  name: 'Instagram', value: 'https://image.flaticon.com/icons/png/128/174/174855.png'},
                {  name: 'Youtube', value: 'https://cdn.icon-icons.com/icons2/195/PNG/256/YouTube_23392.png'},
                {  name: 'pinterest', value: 'https://cdn2.iconfinder.com/data/icons/social-icons-33/128/Pinterest-128.png' },
                {  name: 'linkedin', value: 'https://cdn.iconscout.com/icon/free/png-256/linkedin-160-461814.png' },
                {  name: 'tumblr', value: 'http://icons.iconarchive.com/icons/danleech/simple/256/tumblr-icon.png' },
              ]
            },
        ],
        },
      },
    });




  

    }); // init editor grapesjs
      editor.runCommand('open-structure');
      document.getElementById('blocks').style.display = 'block';
  } // ngOnInit


  
  preview() {
    copia_editor.Commands.run('preview'); 
  }

  show_traits(){
    if(document.getElementById("traits-container").style.display === 'none'){
      document.getElementById("traits-container").style.display = '';
    }else{
      document.getElementById("traits-container").style.display = 'none';
    }
  }

  go_back() {
    document.getElementById('botones').style.display = '';
    document.getElementById('open-structure').style.display = '';
    document.getElementById('open-blocks').style.display = '';
    document.getElementById('title_newsletter').style.display = '';
    document.getElementById('button_styles').style.display = 'none';
    document.getElementById('button_back').style.display = 'none';
    document.getElementById('blocks').style.display = '';
    document.getElementById('show-style').style.display = 'none';

    if (copia_editor.Panels.getButton('title_styles', 'show-style').attributes.active === true) {
      copia_editor.Panels.getButton('botones', 'open-blocks').set('active',false);
      copia_editor.Panels.getButton('title_styles', 'show-style').set('active',false);
      copia_editor.Panels.getButton('botones', 'open-structure').set('active',true);
    }
  }




  /** ------------------------------
        CERRAR PANEL (flechas)
  ---------------------------------- */
  closePanel(close){
   if(close === 'left'){
    document.getElementById('panel_left').style.display = 'none'
    document.getElementById('closeIzq').style.display = 'none'
    document.getElementById('openIzq').style.display = ''
   }else if(close === 'right'){
    document.getElementById('layers').style.display = 'none'
    document.getElementById('closeDer').style.display = 'none'
    document.getElementById('openDer').style.display = ''
   }
  }


  
  /** ------------------------------
           ABRIR PANEL (flechas)
  ---------------------------------- */
  openPanel(open){
    if(open === 'left'){
      document.getElementById('panel_left').style.display = ''
      document.getElementById('closeIzq').style.display = ''
      document.getElementById('openIzq').style.display = 'none'
    }else if(open === 'right'){
      document.getElementById('layers').style.display = ''
      document.getElementById('closeDer').style.display = ''
      document.getElementById('openDer').style.display = 'none'
    }    
  }

}
