import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

import { from } from 'rxjs';
import { Cardviewclass } from 'app/routes/addons/inteligencia/cardview-inteligencia/cardview.class';

/**
 * Servicios usados en el módulo de Inteligencia
 * 
 * Actualmente en desuso
 * 
 * Estos servicios pueden ser usados en cualquiera de los componentes que estén dentro de Inteligencia
 */
@Injectable({
    providedIn:'root'
})
export class InteligenciaService {
    /**@ignore */
    private messageSource = new BehaviorSubject<Cardviewclass>(new Cardviewclass("card 2","Clustering",2,"horas",new Date("Wed, 12 March 2018 13:30:00"),"Buyer Empresa","Kmeans",{algorithm: "auto",max_iter: 300,n_clusters: 1,n_clusters_user: 5,n_init: 10}));
    /**@ignore */
    currentMessage = this.messageSource.asObservable();

    /**Array que contiene los datos de la tabla */
    public arr_:Cardviewclass[]=[];

    /**@ignore */
    aux = from(this.arr_)
    /**@ignore */
    aux_ = this.aux.subscribe(val => val)
    
    constructor() { }
  
    /**@ignore */
    changeMessage(a:Cardviewclass){
        this.messageSource.next(a);
    }
    /**@ignore */
    add(a:Cardviewclass){
        this.arr_.push(a);
    }
}