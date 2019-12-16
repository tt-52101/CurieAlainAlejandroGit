import { Component, OnInit, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { _HttpClient } from '@delon/theme';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { NzMessageService } from 'ng-zorro-antd';
import { HttpClient } from '@angular/common/http';
import { I18NService } from '@core';
import { CardviewJson } from '../cardview-inteligencia/cardview.class';
// import { InteligenciaService } from '@core/services/inteligencia.service';
import { CrmService } from '@core/services/crm.service';
import { Modules } from '@shared/utils/modules.enum';
import { Router } from '@angular/router';
@Component({
  selector: 'app-inteligencia-form-clustering',
  templateUrl: './form-clustering.component.html',
})
export class InteligenciaFormClusteringComponent implements OnInit {
  form_kmeans: FormGroup;
  form_hdbscan: FormGroup;
  form_meanshift: FormGroup;
  form_name: FormGroup;
  submitting = false;
  out_api;
  loading=false;
  algo_="hdbscan";
  type_="BuyerEmpresa";
  time_u_="weeks";
  time_n_=4;
  date_=new Date();
  description_algo_;
  send;
  send_json;
  script_;
  name;


  constructor(
    public i18:I18NService,
    private fb: FormBuilder,
    private msg: NzMessageService,
    private cdr: ChangeDetectorRef,
    private http:HttpClient,
    // private iser:InteligenciaService,
    private crm:CrmService,
    private message: NzMessageService,
    private router:Router
    ) {}

  ngOnInit(): void {
    this.form_kmeans = this.fb.group({
      n_clusters: [1, []],
      n_clusters_user: [5, []],
      n_init: [10, []],
      max_iter: [300, []],
      algorithm:['auto',[]],
    });
    this.form_hdbscan = this.fb.group({
      min_cluster_size: [5, []],
      min_samples: [0, []],
      min_samples_user: [1, []],
      alpha: [0, []],
      alpha_user: [1.0, []],
      leaf_size: [60, []],
      allow_single_cluster: [false, []],
    });
    this.form_meanshift = this.fb.group({
      bandwidth: [0, []],
      bandwidth_user: [2, []],
      bin_seeding: [false, []],
      cluster_all: [true, []],
    });
    this.form_name = this.fb.group({
      name:[,[]],
    });

    this.act_text();
  }
  act_text(){
    switch(this.algo_){
      case "kmeans":
      this.description_algo_=this.i18.fanyi('inteligencia.clustering.kmeans.description');
      break;
      case "hdbscan":
      this.description_algo_=this.i18.fanyi('inteligencia.clustering.hdbscan.description');
      break;
      case "meanshift":
      this.description_algo_=this.i18.fanyi('inteligencia.clustering.meanshift.description');
      break;
    }
  }

  rand_name(){
    this.name  = Math.random().toString(36).substring(5);
    console.log(this.name)
  }

  // Actualiza o carga el send en array y en JSON
  load_send(){

    switch(this.algo_){
      case "kmeans":
        this.script_=1;
        this.send = ["clustering","kmeans",this.type_,this.name,this.form_kmeans.value.n_clusters, this.form_kmeans.value.n_clusters_user, this.form_kmeans.value.n_init, this.form_kmeans.value.max_iter, this.form_kmeans.value.algorithm]
        this.send_json={
          "n_clusters":         this.form_kmeans.value.n_clusters,
          "n_clusters_user":    this.form_kmeans.value.n_clusters_user,
          "n_init":             this.form_kmeans.value.n_init,
          "max_iter":           this.form_kmeans.value.max_iter,
          "algorithm":          this.form_kmeans.value.algorithm
        }
      break;
      case "hdbscan":
        this.script_=2;
        this.send = ["clustering","hdbscan",this.type_,this.name,this.form_hdbscan.value.min_cluster_size, this.form_hdbscan.value.alpha,  this.form_hdbscan.value.alpha_user,  this.form_hdbscan.value.min_samples,  this.form_hdbscan.value.min_samples_user,  this.form_hdbscan.value.leaf_size,  this.form_hdbscan.value.allow_single_cluster]
        this.send_json={
          "min_cluster_size":      this.form_hdbscan.value.min_cluster_size,
          "alpha":                 this.form_hdbscan.value.alpha,
          "alpha_user":            this.form_hdbscan.value.alpha_user,
          "min_samples":           this.form_hdbscan.value.min_samples,
          "min_samples_user":      this.form_hdbscan.value.min_samples_user,
          "leaf_size":             this.form_hdbscan.value.leaf_size,
          "allow_single_cluster":  this.form_hdbscan.value.allow_single_cluster
        }
        break;
      case "meanshift":
        this.script_=3;
        this.send = ["clustering","meanshift",this.type_,this.name,this.form_meanshift.value.bandwidth,this.form_meanshift.value.bandwidth_user, this.form_meanshift.value.bin_seeding, this.form_meanshift.value.cluster_all]
        this.send_json={
          "bandwidth":      this.form_meanshift.value.bandwidth,
          "bandwidth_user": this.form_meanshift.value.bandwidth_user,
          "bin_seeding":    this.form_meanshift.value.bin_seeding,
          "cluster_all":    this.form_meanshift.value.cluster_all
        }
        break;
    }

  }

  /** Manda los datos al servidor para que este pueda ejecutarlos en Python */
  submit() {
    this.loading=true;
    this.submitting = true;
    this.out_api=""
    this.load_send();
    const script_ = this.script_;
    const send = this.send;

    this.http.post('http://localhost:3000/api/inteligencia/leads',{arg:send, script:script_}).subscribe(res=>{
                //  https://demo.curieplatform.com/api/inteligencia/leads
                //  http://localhost:3000/api/inteligencia/leads
      this.submitting = false;
      console.log(res);
      this.out_api = res;
      this.loading=false;
      // TODO: Actualizar Status  ==>  res['status']
    },err=>{
      this.submitting = false;
      console.log("ERROR POST:")
      console.log(err)
      this.loading=false;
    });
  }

  predict_element(){
    const send = "hola";
    this.http.post('http://localhost:3000/api/inteligencia/leads',{arg:send, script:4}).subscribe(res=>{
                //  https://demo.curieplatform.com/api/inteligencia/leads
                //  http://localhost:3000/api/inteligencia/leads
      this.submitting = false;
      console.log(res);
      this.out_api = res;
      this.loading=false;
    },err=>{
      this.submitting = false;
      console.log("ERROR POST:")
      console.log(err)
      this.loading=false;
    });
  }

  add_program(activo:number = 2){
    // console.log("add");
    this.load_send();
    if(this.name === "" || this.name == null){
      this.rand_name()
    }
    const json_data:CardviewJson={
      "name":this.name,
      "type":"Clustering",
      "time_n":this.time_n_,
      "time_u":this.time_u_,
      "first":this.date_,
      "model":this.type_,
      "algorithm":this.algo_,
      "algorithm_data":this.send_json,
      "status":activo
    }


    // this.iser.changeMessage(js2cardview(json_data));
    // this.iser.add(js2cardview(json_data));

    this.crm.createRecord(Modules.user_clustering,json_data).subscribe(res =>
      {
        console.log(json_data);
        console.log(res);
        if(res.status === 1){
          this.message.create('success', 'Se ha creado programado correctamente');
        }
        else{
          this.message.create('error', 'No se ha creado el programa');
        }
      },req =>{
        console.log(req)
        this.message.create('error', `No se ha creado el programa ${req.status}`);
      }
    )
  }

  cancelar(){
    this.message.create('warning', 'Cancelado');
    this.router.navigateByUrl("/addons/inteligencia");
  }

}
