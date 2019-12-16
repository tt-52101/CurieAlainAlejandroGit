import { GenericModel } from './GenericModel';

export class User extends GenericModel {

    id: number = null;
    username: string = null;
    name: string = null;
    role: string = null;
    groups: string[] = null;

    constructor(config?: object) {
        super();
        this.exclusions = [
            {
                field: 'id',
                handler: () => {
                    this.id = config['userid'];
                }
            }
        ]
        this.constructorParse(config);
    }
}
