import { GenericModel } from './GenericModel';

export class Incidence extends GenericModel {
    mod: string = "HelpDesk";
    user: number = null;
    name: string = null;
    description: string = null;
    date_start: Date = null;
    date_end: Date = null;
    parent: Object[] = [
        {
            id: null,
            mod: "Accounts"
        },
        {
            id: null,
            mod: "ServiceContracts"
        },
        {
            id: null,
            mod: "Contacts"
        }
    ]

    constructor(params?: any) {
        super();
        this.constructorParse(params);
    }

}

// Modelo  viejo (NO FUNCIONA)
// "id": 200;
// "module": "HelpDesk",
// "name": "pruba",
// "user": {
//     "id": 1,
//     "label": " Demo"
// },
// "parent": {
//     "id": 2,
//     "label": "null",
//     "mod": "ServiceContracts"
// },
// "description": "Descripcion",
// "date_start": "2019-07-17",
// "date_end": "2019-07-17",
// "status": {
//     "value": "PLL_PTE_PLANIFICAR",
//     "label": "Pte. planificar"
// },
// "progress": 0;
