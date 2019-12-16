import { Component, OnInit } from '@angular/core';
import { PdiService } from '@core';

@Component({
  selector: 'app-cn-conf',
  templateUrl: './cn-conf.component.html',
  styleUrls: ['./cn-conf.component.less']
})
export class CnConfComponent implements OnInit {

  cnSettings = [{
    module: "modulename",
    active: false,
    autSync: false,
    frecuency: "each day",
    lastSync: "last year"
  }];

  constructor(private pdi: PdiService) { }

  ngOnInit() {
    this.loadData(localStorage.getItem('cnName'));
  }

  /**
   * Load data of the clicked connection
   * @param name: string
   */
  async loadData(name: string) {
    try {
      localStorage.removeItem('cnName');
      //const cnData = await this.pdi.getCnData(name).toPromise();
      //console.log(cnData);
    } catch (error) {
      console.log(error);
    }
  }
}
