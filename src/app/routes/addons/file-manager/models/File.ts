import { GenericModel } from './GenericModel';

export class File extends GenericModel {

    id: string = null;
    name: string = null;
    mimeType: string = null;
    parents?: [] = null;
    permissions?: [] = null;
    key: string = null;
    title: string = '';

    constructor(data?: object) {
        super();
        this.constructorParse(data);
    }

}
