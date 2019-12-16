/**
 * Esta Interface contiene lo mínimo necesario para poder usar la clase
 */
export interface CardviewJson{
    /**Nombre o ID representativo */
    "name":string,
    /**Tipo de Inteligencia que se ha elegido (ej.:Clustering) */
    "type":string,
    /**Tiempo numeral (1,2,3,etc) */
    "time_n":number,
    /**Tiempo en unidades (horas,días,semanas) */
    "time_u":string,
    /**Primera vez que se ejecuta el programa */
    "first":Date,
    /**BD a la que se ataca */
    "model":string,
    /**Algoritmo usado (ej.:K-Means) */
    "algorithm":string,
    /**Parámetros del algoritmo escogído */
    "algorithm_data":{},
    /**Estado del programa 0-4 (Error, Activo, Desactivado, Procesando, Wargning) */
    "status"?:number
}

/**
 * Esta es la clase que recibe el json minimo (CardviewJson) mediante
 * js2cardview y completar los campos restantes, o mediante el constructor
 */
export class Cardviewclass{
    /**Nombre o ID representativo */
    name:string= Math.random().toString(36).substring(5);
    /**Tipo de Inteligencia que se ha elegido (ej.:Clustering) */
    type:string = "Clustering";
    /**Tiempo numeral (1,2,3,etc) */
    time_n:number =4;
    /**Tiempo en unidades (horas,días,semanas) */
    time_u:string ="weeks";
    /**String formateado entre time_n y time_u */
    time_ = this.time_n + " " + this.time_u;
    /**Primera vez que se ejecuta el programa */
    first:Date = new Date();
    /**BD a la que se ataca */
    model:string;
    /**Algoritmo usado (ej.:K-Means) */
    algorithm:string;
    /**Parámetros del algoritmo escogído */
    algorithm_data:{};
    /**Próxima vez que se ejecutará el algoritmo en base a la fecha actual, la fecha inicial y la frecuencia */
    next_:Date;
    /**Estado del programa 0-4 (Error, Activo, Desactivado, Procesando, Wargning) */
    status:number;

    /**
     * Devuelve el número de horas en base a time_n (ej.: 4) y time_u (ej.: days) ==> 4 days => 4*24 => 96 horas
     */
    time():number{
        let aux=this.time_n;
        switch(this.time_u.toLowerCase()){
            case 'days':
            case 'day':
            case 'días':
            case 'día':
            case 'dia':
            case 'dias':
            case 'd':
                aux*=24;
            break;
            case 'weeks':
            case 'week':
            case 'semanas':
            case 'semana':
            case 's':
            case 'w':
                aux*=24*7
            break;
        }
        return aux;
    }

    /**
     * Calcula la próxima vez que se ejutará en base a la fecha de origen y a la frecuencia
     */
    next():Date{
        if(this.time_n > 0){
            const n = this.time();
            const aux = this.first;
            const current = new Date();
            while(aux<current){
                aux.setTime(aux.getTime() + (n*60*60*1000));
            }
            return aux
        }
        return new Date();
    }

    /**
     * Constructor de la clase
     * @param name nombre o identificador
     * @param type tipo de algoritmo
     * @param time_n frecuencia con la que se repite (numérica)
     * @param time_u frecuencia con la que se repite (unidad)
     * @param first primera vez que se ejecuta
     * @param model BD a la que se ataca
     * @param algorithm tipo de algoritmo escogido
     * @param algorithm_data parámetros del algoritmo escogido
     * @param status estado del programa
     */
    constructor(name:string,
                type:string,
                time_n:number,
                time_u:string,
                first:Date,
                model:string,
                algorithm:string,
                algorithm_data:{},
                status:number=2){

        this.name=name;
        this.type=type;
        this.time_n=time_n;
        this.time_u=time_u;
        this.time_ = this.time_n + " " + this.time_u;
        this.first=first;
        this.next_=this.next();
        this.model=model;
        this.algorithm=algorithm;
        this.algorithm_data=algorithm_data;
        this.status=status;
    }

    /**
     * Devuelve el objeto como un JSON
     */
    export():JSON{
        const a=JSON.parse("{}");
        a["name"]=this.name;
        a["type"]=this.type;
        a["time_n"]=this.time_n;
        a["time_u"]=this.time_u;
        a["first"]=this.first;
        a["model"]=this.model;
        a["algorithm"]=this.algorithm;
        a["algorithm_data"]=this.algorithm_data;
        a["status"]=this.status;
        return a;
    }
    /**Misma funcionalidad que export(), devuelve el objeto como un JSON */
    json():JSON{return this.export()}

    /**
     * Compara la frecuencia con otro objeto
     *  0  =  iguales
     *  1  =  a > b
     * -1  =  b < a
     * @param other Otro objeto de tipo Cardviewclass
     */
    compare_each(other:Cardviewclass):number{
        const a = this.time();
        const b = other.time();
        if(a === b) return 0;
        else if( a > b) return 1;
        else return -1;
    }
}

/**
 * La función que devuelve un objeto de tipo Cardviewclass mediante un json
 * @param a Json minimo para cargar la clase
 */
export function js2cardview(a:CardviewJson){
    return new Cardviewclass(a["name"],a["type"], a["time_n"],a["time_u"],a["first"],a["model"],a["algorithm"],a["algorithm_data"], a["status"]);
}
