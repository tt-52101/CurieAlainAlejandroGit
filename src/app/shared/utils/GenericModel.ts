export interface IExportParams {
  required?: string[];
  delete?: string[];
}

/**
 * Interfaz para los campos que se tengan que transformar
 */
export interface ExclusionI {
  field: string;
  handler: any;
}

export abstract class GenericModel {

  protected exclusions: ExclusionI[];

  constructor(data?: object) {
    if (data !== undefined) {
      Object.getOwnPropertyNames(this).forEach(e => {
        const exception: ExclusionI = this.exclusions.find(y => y.field === e);
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
            this[e] = data[e]
              break;
          }
        }
      })
    }
  }
  /**
   * Convierte la clase en un objeto plano
   * @param reqField Parametros a incluir
   */
  protected export(params: IExportParams): object {
    const toReturn: object = {};
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
    delete toReturn['exclusions'];
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
    const thisObject = this.export({});
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
