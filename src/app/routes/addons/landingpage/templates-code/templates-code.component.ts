import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-templates-code',
  templateUrl: './templates-code.component.html',
  styleUrls: ['./templates-code.component.less']
})
export class TemplatesCodeComponent implements OnInit {

  html: any;
  css: any;
  isVisible = false;
  isOkLoading = false;
  token = ''

  constructor(private router: Router,private activateRoute: ActivatedRoute) { }

  /**
    * ngOnInit
  */
  ngOnInit() {
    if(localStorage.getItem('landingpage') !== '' && localStorage.getItem('landingpage') !== null ){
      this.activateRoute.queryParams.subscribe(params => {
        this.router.navigateByUrl(`/addons/layoutLandingpage?token=${params['token']}`);
      });
    }else{
      this.activateRoute.queryParams.subscribe(params => {
        this.token = params['token']
      });
      localStorage.setItem('landingpage', '');
    }
  }

    /**
    * Abrir Modal
    */
    showModal(): void {
      this.isVisible = true;
    }

    /**
    * Cancelar Modal
    */
    handleCancel(): void {
      this.isVisible = false;
    }

    /**
    * Se encargada de enviar los datos de HTML/CSS 
    */
    enviarDatos(): void {
      this.isOkLoading = true;
      setTimeout(() => {
        this.isVisible = false;
        this.isOkLoading = false;
      }, 1000);
    
      if (localStorage.getItem('landingpage') === null) { 
        const codigo = '<style>' + this.css + '</style>' + this.html;
        localStorage.setItem('landingpage', codigo );
    } else { 
        const codigo = '<style>' + this.css + '</style>' + this.html;
        localStorage.setItem('landingpage', codigo);
    }
    this.router.navigateByUrl(`/addons/layoutLandingpage?token=${this.token}`);
    }

    
    /**
    * Se encargada de guardar el codigo HTML insertado por el usuario
    * @param event donde se obtiene el fichero html insertado 
    */
    openFileHtml(event) {
      function handleResult(result) {
        that.html = result;
      }
      let that = this;
      const file = event.file;
      const reader = new FileReader();
      reader.readAsText(file.originFileObj);
      reader.onload = () => {
          return handleResult(reader.result);
      };
    }


    /**
    * Se encargada de guardar el codigo CSS insertado por el usuario
    * @param event donde se obtiene el fichero CSS insertado 
    */
    openFileCss(event) {
      function handleResult(result) {
        that.css = result;
      }
      let that = this;
      const file = event.file;
      const reader = new FileReader();
      reader.readAsText(file.originFileObj);
      reader.onload = () => {
        return handleResult(reader.result);
      };
    }
    
}
