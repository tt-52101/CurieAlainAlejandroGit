import { Component, OnInit, Input } from '@angular/core';
import { Router } from '@angular/router';

/**Componente de tipo card que permite muestra una descripción al hacer hover sobre esta. También redirige al hacer click */
@Component({
  selector: 'app-displaypopcard',
  templateUrl: './displaypopcard.component.html'
})
export class DisplaypopcardComponent implements OnInit {
  /**Título del componente */
  @Input() title:string
  /**Descripción del componente*/
  @Input() description:string
  /**Ruta de la imagen del componente */
  @Input() img:string
  /**Ruta a la que se redigirá al hacer click en el componente */
  @Input() linkto:string
  /**Sí está a false permite hacer click, si está a true no.
   * 
   * Debe ser de tipo string, no boolean
   */
  @Input() disabled:string='false';
  /**Parámetro opcional que indica que tamaño tendrá el componente, la imagen tendrá una reducción de 20px respecto a este */
  @Input() width:number=210;

  /**Estilos del componente: width y cursor */
  style:{};
  /**Estilos de la imagen: width, height y padding */
  style_img:{};
  
  /**@ignore */
  constructor(private router: Router) { }
  /**Inicializa los estilos: width y cursor */
  ngOnInit() {
    this.style = { 
      'width': this.width.toString() + 'px',
      'cursor' :  (this.disabled === 'true') ? "not-allowed" : "pointer"
    }
    this.style_img={
      'width': (this.width-20).toString() + 'px',
      'height': (this.width-20).toString() + 'px',
      'padding': '1px'
    }
  }
  /**Redirige la ruta hacia la especificada en el componente al hacer click sobre este */
  linkto_(){
    if(this.disabled==='false'){
      this.router.navigateByUrl(`${this.linkto}`);
    }
    else{
      console.log("Disabled")
    }
  }

}
