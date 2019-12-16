import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { TrackerService } from '@core';
import { STColumn, STData } from '@delon/abc';
import { FullContentService } from '@delon/abc';
import { deepCopy } from '@delon/util';

@Component({
  selector: 'app-viewchart',
  templateUrl: './viewchart.component.html',
  styleUrls: ['./viewchart.component.less']
})
export class ViewchartComponent implements OnInit {

  gridStyle2 = {
    width: '50%',
    textAlign: 'center',
  };

  /* Para cargar los datos de la gráfica. */
  dataGraficEmail: any[] = [];
  arrayVisitEmail: any[] = [];

  /*Para cargar datos de la tabla */
  dataCampains: STData[] = [];
  arrayTableEmail: any[] = [];

  /* Guardamos el action name pasado por URL */
  id: string;
  actionname: string;

  data_copy: any[];
  custom: any[];
  searchInput = [];
  searchStructure = {};
  searchType = {};
  searchColumn: STColumn[];

  constructor(private _route: ActivatedRoute, private trackerServ: TrackerService, private full: FullContentService) {
    this.id = this._route.snapshot.paramMap.get('id')
    this.actionname = this._route.snapshot.paramMap.get('action');
  }

  ngOnInit() {
    this.custom = ['fecha', 'usuario', 'country', 'visit_ip'];
    this.searchColumn = [
      {
        title: 'Fecha',
        i18n: 'app.tracker.table.campaign.fecha',
        renderTitle: this.custom[0],
        index: 'fecha', sort: {
          compare: (a, b) => a.fecha.length - b.fecha.length,
        }
      },
      {
        title: 'Hora',
        i18n: 'app.tracker.campaign.hora',
        index: 'hora', sort: {
          compare: (a, b) => a.hora - b.hora,
        }
      },
      {
        title: 'User',
        i18n: 'app.tracker.campaign.user',
        renderTitle: this.custom[1],
        index: 'user', sort: {
          compare: (a, b) => a.user.length - b.user.length,
        }
      },
      {
        title: 'Type device',
        i18n: 'app.tracker.table.campaign.type_device',
        index: 'type_device', sort: {
          compare: (a, b) => a.type_device.length - b.type_device.length,
        }
      },
      {
        title: 'Browser',
        i18n: 'app.tracker.table.campaign.browser',
        index: 'browser', sort: {
          compare: (a, b) => a.browser.length - b.browser.length,
        }
      },
      {
        title: 'Country',
        i18n: 'app.tracker.table.campaign.country',
        renderTitle: this.custom[2],
        index: 'country', sort: {
          compare: (a, b) => a.country.length - b.country.length,
        }
      },
      {
        title: 'Visit IP',
        i18n: 'app.tracker.table.campaign.visit_ip',
        renderTitle: this.custom[3],
        index: 'visit_ip', sort: {
          compare: (a, b) => a.visit_ip - b.visit_ip,
        }
      }
    ];
    for (let i in this.searchColumn) if (this.searchColumn[i].hasOwnProperty('renderTitle')) this.searchInput.push('')
    this.loadChartMail();
    this.loadCampaignsData();
    this.full.toggle();
  }

  findcolumn(c) {
    const custom_ = this.custom[c]
    for (let i in this.searchColumn) if (this.searchColumn[i].hasOwnProperty('renderTitle')) if (this.searchColumn[i]['renderTitle'] === custom_) return this.searchColumn[i]
  }

  powerSearch(c) {
    this.changeFill(c);
    const column_ = this.findcolumn(c);
    this.searchStructure[`${column_.index}`] = this.searchInput[c];
    if (column_.type === undefined) {
      this.searchType[`${column_.index}`] = 'string';
    } else this.searchType[`${column_.index}`] = column_.type;
    this.fullPowerSearch()
  }

  fullPowerSearch(){
    this.dataCampains = this.data_copy;
    const keys = Object.keys(this.searchStructure)
    for(let i in keys){
      switch(this.searchType[keys[i]]){
        case 'string':
        case 'number':
          console.log(deepCopy(this.dataCampains));
            this.dataCampains = deepCopy(this.dataCampains).filter(w => ~w[keys[i]].toString().indexOf(this.searchStructure[keys[i]].toString()));
        break;
        case 'date': break;
        case 'no':   break;
        case 'yu':   break;
        default:
        break;
      }
    }
  }

  powerResetSearch(c):void{
    const column_ = this.findcolumn(c);
    const colname = column_.index
    this.searchStructure[`${colname}`]='';
    this.searchInput[c]='';
    this.changeFill(c);
    this.fullPowerSearch();
  }

  fullPowerResetSearch(){
    for(let i in this.searchStructure) this.searchStructure[i]='';
    for(let i in this.searchInput) this.searchInput[i]='';
    this.dataCampains = this.data_copy;
    for(let i in document.getElementsByClassName('icon_search_fill')) this.changeFill(i)
  }

  changeFill(i){
    if(this.searchInput[i]!=='' && this.searchInput[i]!==undefined )(<HTMLElement>document.getElementsByClassName('icon_search_fill')[i].firstChild).style.fill = '#00A477'
    else (<HTMLElement>document.getElementsByClassName('icon_search_fill')[i].firstChild).style.fill = "currentColor";
  } 
  /**
   * Método para buscar los datos relacionados con el ID y actionname introducido por URL para cargar gráficas.
   */
  loadChartMail() {
    this.trackerServ.getInfoEmail(this.id, this.actionname).subscribe((data: any) => {
      this.arrayVisitEmail = new Array();
      for (const iterator of data) {
        let number = 0;
        for (const iter of iterator.actionDetails) {
          if (iter.pageTitle == this.actionname) {
            number++;
          }
        }
        if (number != 0) {
          this.arrayVisitEmail.push({
            fecha: iterator.serverDate,
            n_visit: number
          })
        }
      }
      this.dataGraficEmail = new Array(this.arrayVisitEmail.length);
      for (let l = 0; l < this.arrayVisitEmail.length; l++) {
        this.dataGraficEmail[l] = {
          x: this.arrayVisitEmail[l].fecha,
          y: this.arrayVisitEmail[l].n_visit
        };
      }
    });
  }

  /**
   * Método para cargar otros datos de interes que se cargaran en una tabla.
   */
  loadCampaignsData() {
    this.trackerServ.getInfoEmail(this.id, this.actionname).subscribe((data: any) => {
      for (const item of data) {
        this.arrayTableEmail.push({
          fecha: item.serverDate,
          hora: item.serverTimePretty,
          user: item.userId,
          type_device: item.deviceType,
          browser: item.browser,
          country: item.country,
          visit_ip: item.visitIp,
        })
      }
      this.dataCampains = this.arrayTableEmail;
      this.data_copy= this.dataCampains;
    });
  }
}