import { Component, OnInit, Input, ViewChild } from '@angular/core';
import {Cardviewclass, js2cardview} from "./cardview.class";
import { STComponent, STColumn, STColumnSource, STColumnBadge } from '@delon/abc';
import { _HttpClient, ModalHelper } from '@delon/theme';
import { NzMessageService } from 'ng-zorro-antd';
import { ModulosService } from '@core';
import { LoginService } from '@core/services/login.service';
import { CrmService } from '@core/services/crm.service';
import { Modules } from '@shared/utils/modules.enum';


@Component({
  selector: 'app-cardview-inteligencia',
  templateUrl: './cardview-inteligencia.component.html'
})
export class CardviewInteligenciaComponent implements OnInit {

  @ViewChild('st')

  private readonly st: STComponent;

  constructor(
    private crm:CrmService,
    private http: _HttpClient,
    private msg: NzMessageService,
    private modalHelper: ModalHelper,
    private log:LoginService,
    private modulosService:ModulosService
  ) { }

  params: any = {};

  BADGE: STColumnBadge = {
    0: { text: 'Error', color: 'error' },
    1: { text: 'Activo', color: 'success' },
    2: { text: 'Inactivo', color: 'default' },
    3: { text: 'Procesando', color: 'processing' },
    4: { text: 'Warning', color: 'warning' },
  };

  columns: STColumn[] = [
    { title: 'Name', index: 'name',
      sort:{
        compare:(a: any, b: any) => ('' + a.name).localeCompare(b.name),
      },
    },
    { title: 'Type', index: 'type',
      sort:{
        compare:(a: any, b: any) => ('' + a.type).localeCompare(b.type),
      },
    },
    { title: 'Each', index: 'time_',
      sort:{
        compare:(a:Cardviewclass,b:Cardviewclass)=> a.compare_each(b),
      }
    },
    { title: 'From', index: 'first',
      type: 'date',
      sort:{
         compare:(a: any, b: any) => ('' + a.first).localeCompare(b.first),
      },
    },
    { title: 'Next at', index: 'next_',type: 'date',
      sort:{
        compare:(a: any, b: any) => ('' + a.next_).localeCompare(b.next_),
      },
    },
    { title: 'Model', index: 'model',
      sort:{
        compare:(a: any, b: any) => ('' + a.model).localeCompare(b.model),
      },
    },
    { title: 'Algorithm', index: 'algorithm',
      sort: {
        compare: (a: any, b: any) =>  ('' + a.algorithm).localeCompare(b.algorithm),
      },
    },
    { title: 'Status', index:'status', type: 'badge', badge: this.BADGE,
      sort:{
        compare:(a: any, b: any) => ('' + a.status).localeCompare(b.status),
      },
    },
    { title: '',
      buttons: [
        {
          icon: 'edit',
          type: 'static',
          modal: {
            // component: ArticlesEditComponent,
            size: 'lg',
            paramsName: 'i',
          },
          click: (item: any)=>alert("no implementado aún"),
        },
      ],
    },
  ];

  arr_views:Cardviewclass[]=[
    new Cardviewclass("card 1",
                      "Clustering",
                      12,
                      "días",
                      new Date("Wed, 27 July 2018 13:30:00"),
                      "Buyer Persona",
                      "Hdbscan",
                      {
                        allow_single_cluster: false,
                        alpha: 0,
                        alpha_user: 1,
                        leaf_size: 60,
                        min_cluster_size: 50,
                        min_samples: 0,
                        min_samples_user: 1
                      }),
    new Cardviewclass("card 2",
                      "Clustering",
                      2,
                      "horas",
                      new Date("Wed, 12 March 2018 13:30:00"),
                      "Buyer Empresa",
                      "Kmeans",
                      {
                        algorithm: "auto",
                        max_iter: 300,
                        n_clusters: 1,
                        n_clusters_user: 5,
                        n_init: 10
                      })
  ];

  ngOnInit() { this.load_table() }

  scrolltotop(){window.scrollTo(0,0)}
  load_table(){
    const that = this;
    this.crm.getLists(Modules.user_clustering).subscribe(res =>
      {
        this.arr_views=[]
        res.forEach(x => {
          if(typeof(x.algorithm_data) === "string")x.algorithm_data=JSON.parse(x.algorithm_data)
          if(typeof(x.algorithm_data)===typeof(JSON)){
            this.arr_views.push(js2cardview(x))
          }
          else{
              console.log("Formato incorrecto")
              console.log(typeof(x.algorithm_data))
              console.log(x.algorithm_data);
          }
        })
        new Promise(function(resolve, reject) {
          window.scrollTo(0,0);
          that.st.reload();
        }).then(() => window.scrollTo(0, 0)).then(() => window.scrollTo(0, 0));
      }

    )


  }


  keys(a:JSON):string[]{ return Object.keys(a)  }


  isVisibleAddInteligencia=false;
  showAddInteligencia()        : void { this.isVisibleAddInteligencia = true; }
  handleCancelAddInteligencia(): void { this.isVisibleAddInteligencia = false; }
  handleOkAddInteligencia()    : void { this.isVisibleAddInteligencia = false; }


  inteligencias: any[] = [
    {tab: 'Clustering',         key: 'clustering',  disabled: 'false',  img:'./../../../../../assets/img/icons/inteligencia/clustering.png',          description:'Statistical classification technique in which cases, data, or objects (events, people, things, etc.) are sub-divided into groups (clusters) such that the items in a cluster are very similar (but not identical) to one another and very different from the items in other clusters. It is a discovery tool that reveals associations, patterns, relationships, and structures in masses of data.'},
    {tab: 'Association',        key: '',            disabled: 'true',   img:'./../../../../../assets/img/icons/inteligencia/association.png',         description:'blablabl ablabla bla blablablablabl ablabla bla blablablablabl ablabla bla blabla'},
    {tab: 'Classification',     key: '',            disabled: 'true',   img:'./../../../../../assets/img/icons/inteligencia/classification.png',      description:'blablabl ablabla bla blablablablabl ablabla bla blabla'},
    {tab: 'Forecasting',        key: '',            disabled: 'true',   img:'./../../../../../assets/img/icons/inteligencia/forecasting.png',         description:'blablabl ablabla bla blabla blablabl ablabla bla blabla blablabl ablabla bla blabla'},
    {tab: 'Regression',         key: 'regression',  disabled: 'false',   img:'./../../../../../assets/img/icons/inteligencia/regression_analysis.png', description:'blablabl ablabla bla blablablablabl ablabla bla blablablablabl ablabla bla blablablablabl ablabla bla blablablablabl ablabla bla blabla'},
    {tab: 'Sequence discovery', key: '',            disabled: 'true',   img:'./../../../../../assets/img/icons/inteligencia/sequence_discovery.png',  description:'blablabl ablabla bla blabla'},
    {tab: 'Visualization',      key: '',            disabled: 'true',   img:'./../../../../../assets/img/icons/inteligencia/visualization.png',       description:'blablabl ablabla bla blablablablabl ablabla bla blabla  blablabl ablabla bla blablablablabl ablabla bla blabla'},
  ];

}

