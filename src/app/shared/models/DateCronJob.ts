import { GenericModel } from './GenericModel';
import { runInThisContext } from 'vm';

export class DateCronJob extends GenericModel {

    frecuencia: string[] = ["minuto", "hora", "dia del mes", "mes", "dia de la semana"]
    number: number = null
    resultado: string = null;

    constructor(data?: object) {
        super();
        this.constructorParse(data);
        this.formatear(data);
    }

    formatear(datos) {
        let schema = "*/* * * * *"
        let d = datos.frecuencia
        function equal(element) {
            if (element == d) {
                return element;
            }
        }
        let pos = this.frecuencia.findIndex(equal);
        let array = schema.split(" ");
        if (pos == 0 && this.number >= 0 && this.number <= 59) {
            array[pos] = ("*/" + datos.number).toString();
        }
        if (pos == 1 && this.number >= 0 && this.number <= 23) {
            array[pos] = (datos.number).toString();
            array[0] = ("*/" + 1).toString();
            
        }
        if (pos == 2 && this.number >= 1 && this.number <= 31) {
            array[pos] = (datos.number).toString();
            array[0] = ("*/" + 1).toString();
            array[1] = (1).toString();
        }
        if (pos == 3 && this.number >= 1 && this.number <= 12) {
            array[pos] = (datos.number).toString();
            array[0] = ("*/" + 1).toString();
            array[1] = (1).toString();
        }
        if (pos == 4 && this.number >= 1 && this.number <= 7) {
            array[pos] = (datos.number).toString();
            array[0] = ("*/" + 1).toString();
            array[1] = (1).toString();
        }
        this.resultado = array.join(" ");
    }

    getResult() {
        return this.resultado;
    }
}