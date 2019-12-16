/**
 * Estructura de un formulario de tipo KMEANS
 */
export interface KmeansInterface{
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

    /** Si 1 == "Auto", si 0 == n_clusters_user; son los n clusters que habrá al final */
    n_clusters:number;
    /** Si n_clusters == FALSE, se ejecuta el algoritmo para x cantidad de clusters */
    n_clusters_user:number;
    /** Número de veces que se ejecutará el algoritmo k-means con diferentes semillas de centroides. Los resultados finales serán la mejor salida de n_init ejecuciones consecutivas en términos de inercia. */
    n_init:number;
    /** Número máximo de iteraciones del algoritmo k-means para una única ejecución. */
    max_iter:number;
    /** Algoritmo que usa el kmeans: "auto", "full" or "elkan" */
    algorithm:string;
}