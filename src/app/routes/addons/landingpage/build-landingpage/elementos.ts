

/**
 * Estructuras
 */
export const Estructuras = [

    // prueba 1 (FORMULARIO)
    /*{
      name: 'input6',
      label: '<div>INPUT 1</div>',
      content: ` <input style="height:30px;width:60%;" placeholder="Escribir texto de ayuda" class="input"/>`,
    },
    // prueba 2 (FORMULARIO)
    {
      name: 'input7',
      label: '<div>INPUT 2</div>',
      content: 
      `<div style="height:150px;width:60%;" draggable="true">
        <label draggable="false" for="Name">Campo Texto</label>
        <input draggable="false" style="height:30px;width:60%;" placeholder="Escribir texto de ayuda" class="input"/>
      </div>
     `,
    },*/
    /*
      name: 'social',
      label: '<div>Social</div>',
      content: 
      `  <a href="" ><img  src="https://i.pinimg.com/originals/ef/b5/d9/efb5d90eeb07bb5914f094007da4c2f7.png" height="35px"/></a>
     `,
    },*/
    {
      name: 'section1',
      label: '<div><img style="max-width:100%;" src="../../assets/newsletter/images/Estructura1.svg"></div>',
      content: `
      <table style="height: 320px; padding:15px; margin-bottom: 25px; margin-top: 25px; width: 100%;">
      <tbody style="outline: none !important;">
        <tr style="background-color:white;outline: none !important;text-align: center;">
        <td style="background-color:white;outline: none !important;"></td>
        </tr>
      </tbody>
      </table>`,
    },
    {
      name: 'section2',
      label: '<div><img style="max-width:100%;" src="../../assets/newsletter/images/Estructura2.svg"></div>',
      content:  
      `<table cellpadding="20" cellspacing="20" style="height: 320px; margin: 0 auto 10px auto; padding: 5px;width: 100%;background-color:white;border:none;">
      <tbody style="outline: none !important;">  
      <tr style="background-color:white;border:none; outline: none !important;text-align: center;">
            <td style="width:50%;background-color:white;border:none;margin: 0;padding: 0;"></td>
            <td style="width:50%;background-color:white;border:none;margin: 0;padding: 0;"></td>
        </tr>
      </tbody>
      </table>`,
    },
    {
      name: 'section3',
      label: '<div><img style="max-width:100%;" src="../../assets/newsletter/images/Estructura3.svg"></div>',
      content: 
      `<table cellspacing="15" cellpadding="25" style="height: 320px; margin-bottom: 25px; margin-top: 25px; width: 100%;background-color:white;border:none;">
          <tbody style="outline: none !important;">    
          <tr style="background-color:white;border:none;outline: none !important;text-align: center;">
              <td style="width:33%;background-color:white;border:none;"></td>
              <td style="width:33%;background-color:white;border:none;"></td>
              <td style="width:33%;background-color:white;border:none;"></td>
          </tr>
          </tbody>
      </table>`,
    },
    {
      name: 'section4',
      label:
       `<div >
        <img style="max-width:100%;" src="../../assets/newsletter/images/Estructura4.svg">
      </div> 
      `,
      content:
      `<table cellspacing="15" cellpadding="25" style="height: 350px; margin-bottom: 25px; margin-top: 25px; width: 100%;background-color:white;border:none;">
              <tbody style="outline: none !important;">      
                <tr style="background-color:white;border:none;outline: none !important;text-align: center;">
                  <td style="width:25%;background-color:white;border:none;"></td>
                  <td style="width:25%;background-color:white;border:none;"></td>
                  <td style="width:25%;background-color:white;border:none;"></td>
                  <td style="width:25%;background-color:white;border:none;"></td>
                </tr>
              </tbody>
      </table>`,
    },
    {
      name: 'section5',
      label: '<div><img style="max-width:100%;" src="../../assets/newsletter/images/Estructura5.svg"></div>',
      content: 
      `<table  cellspacing="15" cellpadding="25" style="height:320px; margin-bottom: 25px; margin-top: 25px;width: 100%;background-color:white;border:none;">
          <tbody style="outline: none !important;">        
          <tr style="background-color:white;border:none;outline: none !important;text-align: center;">
              <td style="width: 30%;background-color:white;border:none;"></td>
              <td style="width: 70%;background-color:white;border:none;"></td>
          </tr>
          </tbody>
      </table>`,
    },
    {
      name: 'section6',
      label: '<div><img style="max-width:100%;" src="../../assets/newsletter/images/Estructura6.svg"></div>',
      content: 
      `<table cellspacing="15" cellpadding="25" style="height: 320px;margin-bottom: 25px; margin-top: 25px; width: 100%;background-color:white;border:none;">
          <tbody style="outline: none !important;">    
          <tr style="background-color:white;border:none;outline: none !important;text-align: center;">
              <td style="width: 70%;background-color:white;border:none;"></td>
              <td style="width: 30%;background-color:white;border:none;"></td>
          </tr>
          </tbody>
      </table>`,
    },
  ];
  
  
  
  /**
   * Elementos
   */
  export const Elementos = [
    {
      name: 'elemento1',
      label: '<div><img style="max-width:100%;" src="../../assets/newsletter/images/Texto.svg"></div>',
      content: `
      <div style="font-family: Arial;background-color:white;border:none;padding: 15px;margin:5px;word-break: break-word;min-height: 50px;height: 50px;">
          Insertar texto aquí 
      </div>`,
    },
    {
      name: 'elemento2',
      label: '<div><img style="max-width:100%;" src="../../assets/newsletter/images/Imagen.svg"></div>',
      content:  {
        activeOnRender: 1,
        type: 'image',
        className: 'elemento',
      },
      styles:{
        height: '100px',
        width: '100px'
  
      }
    },
    {
      name: 'elemento3',
      label: '<div><img style="max-width:100%;" src="../../assets/newsletter/images/Encabezado.svg"></div>',
      content: 
      `<div style="background-color: #f1f1f1;text-align: center;color: black;padding: 25px 10px 25px 10px; width:100%;">
        <h1 style="font-family: Arial;font-weight: 100;word-break: break-word;background-color:white;height: 55px;padding: 10px;min-height: 55px;">ENCABEZADO</h1>
      </div>`,
    },
    {
      name: 'elemento4',
      label: '<div><img style="max-width:100%;" src="../../assets/newsletter/images/Imagenytexto.svg"></div>',
      content:
      ` <table cellspacing="15" cellpadding="25" style="height: 300px; margin: auto; padding:18px; width: 100%;text-align: center;background-color: #f1f1f1;border:none;">
              <tbody style="outline: none !important;">     
                <tr style="background-color:white;border:none;outline: none !important;">
                    <td style="width:50%;">
                      <img data-gjs-type="image" width="50%" src="../../assets/newsletter/images/subirimagen.svg"> 
                    </td>
                    <td style="width:50%;background-color:white;border:none;">
                        <div style="font-family: Arial;background-color:white;border:none;padding: 20px;word-break: break-word;height: 150px;min-height: 150px;">
                        Input caption text here. Use the block's Settings tab to change the caption position and set other styles.
                        Input caption text here. Use the block's Settings tab to change the caption position and set other styles.
                        </div>
                    </td>
                </tr>
                </tbody>
              </table>`,
    },
    {
      name: 'elemento5',
      label: '<div><img style="max-width:100%;" src="../../assets/newsletter/images/Tarjeta.svg"></div>',
      content: 
      `<table cellspacing="15" cellpadding="25" style="height: 300px; margin: auto; padding:15px; width: 100%;text-align: center;background-color: #f1f1f1; ">
        <tbody style="outline: none !important;">    
          <tr style="background-color:white;border:none;outline: none !important;text-align: center;">
            <td style="border:none;outline: none !important;">
              <img  data-gjs-type="image" src="../../assets/newsletter/images/subirimagen.svg" width="25%">
            </td>
          </tr>
          <tr style="background-color:white;border:none;outline: none !important;text-align: center;">
          <td style="background-color:white;border:none;">
            <div style="font-family: Arial;cursor: text;background-color:white;border:none;padding:20px;word-break: break-word;height: 60px;min-height: 60px;">
              Input caption text here. Use the block's Settings tab to change the caption position and set other styles.
            </div>
          </td>
          </tr>
        </tbody>
      </table>`,
    },
    {
      name: 'elemento6',
      label: '<div><img style="max-width:100%;" src="../../assets/newsletter/images/Video.svg"></div>',
      content: `
       <iframe allowfullscreen="allowfullscreen" style="height: 50%; width: 50%;" src="https://www.youtube.com/embed/PMivT7MJ41M?"></iframe> `
    },
    {
      name: 'elemento7',
      label: '<div><img style="max-width:100%;" src="../../assets/newsletter/images/Boton.svg"></div>',
      content: 
      `<div style="display: flex;justify-content: center;">
          <a href="" style="font-family: Arial;padding: 15px;width: 190px;height: 55px;min-height: 55px;color: white;font-size: 23px;text-decoration: none; background-color: #d9d9d9 !important; text-align: center; font-family: Lato, sans-serif;">Click</a>
       </div>`,
    },
    {
      name: 'elemento8',
      label: '<div><img style="max-width:100%;" src="../../assets/newsletter/images/rrss.svg"></div>',
      type: 'social',
      content: 
      `
      <table cellspacing="5" style="margin: auto; padding:10px; width: 50%; text-align:center;">
        <tr style="height:60px">
          <td style="width:20%;">
            <a href="" ><img src="https://image.flaticon.com/icons/png/128/174/174855.png" height="35px"/></a>
          </td>
          <td style="width:20%;">
            <a href="" > <img src="https://i.pinimg.com/originals/ef/b5/d9/efb5d90eeb07bb5914f094007da4c2f7.png" height="35px"> </a>
          </td>
          <td style="width:20%;">
            <a href="" > <img src="https://cdn2.iconfinder.com/data/icons/metro-uinvert-dock/256/Twitter_NEW.png" height="35px"> </a>
          </td>
          <td style="width:20%;">
          <a href="" > <img src="https://cdn2.iconfinder.com/data/icons/social-icons-33/128/Pinterest-128.png" height="35px"> </a>
          </td>
          <td style="width:20%;">
          <a href="" > <img src="https://cdn.icon-icons.com/icons2/195/PNG/256/YouTube_23392.png" height="35px"> </a>
          </td>
        </tr>
      </table>
      `,    
    },
    {
      name: 'elemento9',
      label: '<div><img style="max-width:100%;" src="../../assets/newsletter/images/Compartir.svg"></div>',
      type: 'social',
      content: 
        `<table cellspacing="5" style="margin: auto; padding:10px; width: 50%; text-align:center;">
        <tr style="height:60px">
          <td style="width:20%;">
            <a href="" > <img src="https://marcoymaria.curieplatform.com/crm/storage/RRSS/Instagram.png" height="35px"> </a>
          </td>
          <td style="width:20%;">
          <a href="" > <img src="https://marcoymaria.curieplatform.com/crm/storage/RRSS/Facebook.png" height="35px"> </a>
          </td>
          <td style="width:20%;">
          <a href="" > <img src="https://marcoymaria.curieplatform.com/crm/storage/RRSS/Twitter.png" height="35px"> </a>
          </td>
          <td style="width:20%;">
          <a href="" > <img src="https://marcoymaria.curieplatform.com/crm/storage/RRSS/Pinterest.png" height="35px"> </a>
          </td>
          <td style="width:20%;">
          <a href="" > <img src="https://marcoymaria.curieplatform.com/crm/storage/RRSS/Youtube.png" height="35px"> </a>
          </td>
        </tr>
      </table>`
    },
    {
      name: 'elemento10',
      label: '<div><img style="max-width:100%;" src="../../assets/newsletter/images/Espaciador.svg"></div>',
      content: {
        content: `<div style="height:60px;"></div>`,
        draggable: true,
        droppable: false,
        className: 'elemento',
      }
    },
    {
      name: 'elemento11',
      label: '<div><img style="max-width:100%;" src="../../assets/newsletter/images/Separador.svg"></div>',
      content:  
      `<div style="margin: auto; padding:15px; width: 100%;background-color:white;">
        <hr style="height: 8px;background-color: #d9d9d9;border: none;">
      </div>`
    }
  ];
  
  
  
  // Traducción de texto a Español (y hacer magia)
  export function translate(){
  
    
   document.querySelector('#gjs-sm-border-collapse .gjs-sm-label ').innerHTML = `<span class="gjs-sm-icon " title="">Border collapse (only table)</span>`
  
  
    document.querySelector('#gjs-sm-dimension .gjs-sm-title').innerHTML = `<i id="gjs-sm-caret" class="fa fa-caret-right"></i>Dimensiones`
    document.querySelector('#gjs-sm-typography .gjs-sm-title').innerHTML = `<i id="gjs-sm-caret" class="fa fa-caret-right"></i>Tipografía`
    document.querySelector('#gjs-sm-decorations .gjs-sm-title').innerHTML = `<i id="gjs-sm-caret" class="fa fa-caret-right"></i>Decoración`
  
    // Dimensiones
    document.querySelector('#gjs-sm-width .gjs-sm-label').innerHTML = `<span class="gjs-sm-icon " title="">Ancho</span>`
    document.querySelector('#gjs-sm-height .gjs-sm-label').innerHTML = `<span class="gjs-sm-icon " title="">Altura</span>`
    document.querySelector('#gjs-sm-max-width .gjs-sm-label').innerHTML = `<span class="gjs-sm-icon " title="">Ancho Máximo</span>`
    document.querySelector('#gjs-sm-min-height .gjs-sm-label').innerHTML = `<span class="gjs-sm-icon " title="">Altura mínima</span>`
    document.querySelector('#gjs-sm-margin .gjs-sm-label').innerHTML = `<span class="gjs-sm-icon " title="">Margen</span>`
    document.querySelector('#gjs-sm-margin-top .gjs-sm-label').innerHTML = `<span class="gjs-sm-icon " title="">Arriba</span>`
    document.querySelector('#gjs-sm-margin-left .gjs-sm-label').innerHTML = `<span class="gjs-sm-icon " title="">Izquierda</span>`
    document.querySelector('#gjs-sm-margin-right .gjs-sm-label').innerHTML = `<span class="gjs-sm-icon " title="">Derecha</span>`
    document.querySelector('#gjs-sm-margin-bottom .gjs-sm-label').innerHTML = `<span class="gjs-sm-icon " title="">Abajo</span>`
    
    document.querySelector('#gjs-sm-padding .gjs-sm-label').innerHTML = `<span class="gjs-sm-icon " title="">Relleno</span>`
    document.querySelector('#gjs-sm-padding-top .gjs-sm-label').innerHTML = `<span class="gjs-sm-icon " title="">Arriba</span>`
    document.querySelector('#gjs-sm-padding-left .gjs-sm-label').innerHTML = `<span class="gjs-sm-icon " title="">Izquierda</span>`
    document.querySelector('#gjs-sm-padding-right .gjs-sm-label').innerHTML = `<span class="gjs-sm-icon " title="">Derecha</span>`
    document.querySelector('#gjs-sm-padding-bottom .gjs-sm-label').innerHTML = `<span class="gjs-sm-icon " title="">Abajo</span>`
  
  }
  
  
  // Evento volver Atrás situado en Estilos
  export function showEstructurasElementos(){
      document.getElementById('botones').style.display = '';
      document.getElementById('open-structure').style.display = '';
      document.getElementById('open-blocks').style.display = '';
      document.getElementById('title_newsletter').style.display = '';
      document.getElementById('button_styles').style.display = 'none';
      document.getElementById('button_back').style.display = 'none';
      document.getElementById('blocks').style.display = '';
      document.getElementById('show-style').style.display = 'none';
  }
  
  
  // Mostrar traits
  export function showContenido(){
    document.getElementById('botones').style.display = '';
    document.getElementById('open-structure').style.display = '';
    document.getElementById('open-blocks').style.display = '';
    document.getElementById('title_newsletter').style.display = '';
    document.getElementById('button_styles').style.display = 'none';
    document.getElementById('button_back').style.display = 'none';
    document.getElementById('blocks').style.display = '';
    document.getElementById('show-style').style.display = 'none';
    console.log('show contenido')
  }
  
  