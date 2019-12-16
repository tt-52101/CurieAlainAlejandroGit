import { GenericModel } from './GenericModel';
import { Preferences } from '@shared/typings/User';

export class User extends GenericModel {

  id: number = null;
  name: string = null;
  roles: Map<string, string> = null;
  company: { id: number, name: string } = null;
  preferences: Preferences = {
    kanban: {
      askForDescription: false
    }
  };

  constructor(data?: object) {
    super();
    this.exclusions = [
      {
        field: 'roles',
        handler: (roles: { id: string, name: string }[]) => {
          this.roles = roles.reduce((prev, actual) => prev.set(actual.id, actual.name), new Map<string, string>());
        }
      },
      {
        field: 'preferences',
        handler: (crmpreferences: any) => {
          let { json_kanban } = crmpreferences;
          if (json_kanban.length > 0) {
            if (json_kanban.includes('&quot;')) {
              json_kanban = JSON.parse(json_kanban.replace(/&quot;/g, '"'));
            } else {
              json_kanban = JSON.parse(json_kanban.replace(/\\"/g, '"'));
            }
            this.preferences = json_kanban;
          }
        }
      }
    ]
    this.constructorParse(data);
  }
}
