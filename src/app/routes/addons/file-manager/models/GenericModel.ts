import { Exclusion, IExportParams, RenameI } from '../typings/GenericModel';

/**
 * Tipo de dato para la clase madre
 * @author Ayoze Martín Hernández
 * @version 1.0
 */
export abstract class GenericModel {

  protected exclusions: Exclusion[];

  constructor() { }

  /**
   * Se encarga de parsear datos de un objeto plano a los atributos de la clase
   * @param data Parametros con los datos a parsear
   */
  protected constructorParse(data: object): void {
    if (data !== undefined) {
      Object.getOwnPropertyNames(this).forEach(e => {
        let exception: Exclusion;

        if (this.exclusions !== undefined) {
          exception = this.exclusions.find(y => y.field === e);
        }

        if (exception !== undefined) {
          exception.handler(data[e]);
        } else {
          switch (true) {
            case Array.isArray(data[e]):
              this[e] = [...data[e]];
              break;
            case typeof data[e] === 'object':
              this[e] = { ...data[e] };
              break;
            default:
              // permite especificar valores por defecto
              if (this[e] === null) {
                this[e] = data[e];
              }
              break;
          }
        }
      });
    }
  }

  /**
   * Convierte la clase en un objeto plano
   * @param reqField Parametros a incluir
   * @returns objeto plano con los datos pedidos
   */
  export(params?: IExportParams): object {
    const toReturn: object = {};
    if (params === undefined) {
      params = { delete: ['exclusions'] };
    } else {
      params.delete = params.delete === undefined ? ['exclusions'] : params.delete.concat(['exclusions']);
    }

    if (params.required === undefined) {
      Object.getOwnPropertyNames(this).forEach(e => {
        toReturn[e] = this[e];
      });
    } else {
      params.required.forEach(e => {
        toReturn[e] = this[e];
      });
    }

    if (params.delete !== undefined) {
      params.delete.forEach(e => {
        delete (toReturn[e]);
      });
    }

    if (params.rename !== undefined) {
      params.rename.forEach((e: RenameI) => {
        toReturn[e.to] = toReturn[e.from];
        delete (toReturn[e.from]);
      });
    }

    return toReturn;
  }

  /**
   * Verifica que los parametros minimos no están vacios
   * @param fields parametros requeridos
   */
  filledRequiredFields(fields: string[]): boolean {
    let correct = false;
    fields.forEach(e => {
      correct = this[e] !== undefined && this[e] !== null;
    });
    return correct;
  }

  /**
   * Calcula diferencias entre objetos
   * @param toCompare Objeto con el que comparar
   * @returns objeto con las propiedades diferentes
   */
  differences(toCompare: object): object {
    const aux: object = {};
    const thisObject = this.export();
    Object.keys(thisObject).forEach(e => {
      if (thisObject[e] !== toCompare[e]) {
        aux[e] = toCompare[e];
      } else if (Array.isArray(toCompare[e]) && toCompare[e].length > 0) {
        aux[e] = toCompare[e];
      }
    });
    return Object.keys(aux).length > 0 ? aux : null;
  }
}
