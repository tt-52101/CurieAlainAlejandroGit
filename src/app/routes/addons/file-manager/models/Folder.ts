import { File } from './File'
import { NzTreeNodeOptions } from 'ng-zorro-antd';


export class Folder implements NzTreeNodeOptions {

    id: string = null;
    name: string = null;
    mimeType: string = null;
    parents?: [] = null;
    permissions?: [] = null;
    children?: Folder[] = null;
    title: string = '';
    key: string = '';

    constructor(data?: object) {
        // super();
        // this.constructorParse(data);
    }

}
