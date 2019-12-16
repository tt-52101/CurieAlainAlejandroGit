/**
 * Estructura de un formulario de tipo KMEANS
 */
export interface MeanshiftInterface {
    /** Nombre ID del algoritmo */
    name: string;
    /** Buyer al que ataca: "BuyerEmpresa" ó "BuyerContactos" */
    type: string;
    /** Unidades de tiempo, cada x de time_u se repite */
    time_n: number;
    /** Unidad de tiempo "hours", "days" or "weeks" */
    time_u: string;
    /** Primera vez que se ejecuta el algoritmo, en su defecto el momento en que se crea */
    first: Date;
    // TODO: Poner definición de que es cada cosa
    /** 0 o 1, 0 por defecto */
    bandwidth: number;
    /** 2 por defecto */
    bandwidth_user: number;
    /** false por defecto */
    bin_seeding: boolean;
    /** true por defecto */
    cluster_all: boolean;
}
