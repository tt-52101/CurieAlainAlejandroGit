/**
 * Estructura de un formulario de tipo KMEANS
 */
export interface HdbscanInterface{
    /** Nombre ID del algoritmo */
    name:string;
    /** Buyer al que ataca: "BuyerEmpresa" ó "BuyerContactos" */
    type:string;
    /** Unidades de tiempo, cada x de time_u se repite */
    time_n:number;
    /** Unidad de tiempo "hours", "days" or "weeks" */
    time_u:string;
    /** Primera vez que se ejecuta el algoritmo, en su defecto el momento en que se crea */
    first:Date;
    // TODO: Poner definición de que es cada cosa
    /** 5 por defecto */
    min_cluster_size:number;
    /** 0 o 1, 1 0 por defecto */
    min_samples:number;
    /** 1 por defecto */
    min_samples_user:number;
    /** 0 o 1 */
    alpha:number;
    /** float, 1.0 por defecto */
    alpha_user:number;
    /** 60 por defecto */
    leaf_size:number;
    /** false por defecto */
    allow_single_cluster:boolean;
}