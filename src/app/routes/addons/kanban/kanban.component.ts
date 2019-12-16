import { moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';
import { Component, OnInit } from '@angular/core';
import { CrmService } from '@core/services/crm.service';
import { LoginService } from '@core/services/login.service';
import { FullContentService } from '@delon/abc';
import { SFUISchemaItem } from '@delon/form';
import { Imputation } from '@shared/models/Imputation';
import { Ticket } from '@shared/models/Ticket';
import { KanbanColum, RuleResponse } from '@shared/typings/kanban.component';
import { CrmStatus, CrmSubStatus, statusRelationship } from '@shared/typings/Ticket_enum.enum';
import { Modules } from '@shared/utils/modules.enum';
import * as moment from 'moment';
import { NzMessageService, NzModalService } from 'ng-zorro-antd';
import { map, tap } from 'rxjs/operators';
import { PlanningFormComponent } from "./components/planning-form/planning-form.component";
import { SpinerFactoryService } from '@core/services/spiner-factory.service';
import { environment } from '@env/environment';
import { defaultConfigDatePickers, decimalToSexagesimal } from '@shared/utils/dateUtils';

@Component({
  selector: 'app-kanban',
  templateUrl: './kanban.component.html',
  styleUrls: ['./kanban.component.less']
})
export class KanbanComponent implements OnInit {

  week = {
    start: null,
    end: null,
    date: new Date()
  }
  showCrono: boolean;
  initCronoValue: string;
  datepickerConfig = defaultConfigDatePickers;
  // Obtiene los usuarios (lista para usar en los formularios dinamicos)
  private getUsersFunction = () => {
    return this.crm.getLists(Modules.formulario_atencion_telefonica, { params: { modules: [Modules.usuarios] } }).pipe(
      map((res: any) => res.map(e => {
        return <SFUISchemaItem>{
          label: e.label,
          value: e.id.toString()
        }
      }))
    )
  };
  selectedUser = this.loginService.user.id;
  users: any[] = [];
  currentImputation: Imputation = null;
  list: KanbanColum[] = [
    {
      id: 0,
      title: 'Para hacer',
      key: CrmStatus.todo,
      color: 'red',
      list: [],
      rules: {
        drag: [
          (from: KanbanColum, to: KanbanColum, ticket: Ticket): RuleResponse => {
            return <RuleResponse>{
              resolution: ticket.status.secondary.value !== CrmSubStatus.planning || from.key === to.key,
              error: 'La tarea tiene que se planificada para poder moverla de esta columna'
            }
          }
        ],
        drop: [
          (from: KanbanColum, to: KanbanColum, ticket: Ticket): void => {
            if (from.key !== to.key) {
              ticket.changeStatus(to.key, CrmSubStatus.resume);
            }
          },
          (from: KanbanColum, to: KanbanColum, ticket: Ticket): void => {
            this.updateTaskPriorities(this.list[0].list);
          }
        ],
        change: [
          (column: KanbanColum, ticket: Ticket): RuleResponse | void => {
            const guard = ticket.status.secondary.value !== CrmSubStatus.resume;
            if (ticket.status.secondary.value === CrmSubStatus.planned && guard) {
              ticket.toggleStatus(1);
            } else {
              return <RuleResponse>{
                resolution: guard,
                error: 'Una vez se llege al estado de retomar, la tarjeta se tiene que cambiar de columna'
              }
            }
          },
          (column: KanbanColum, ticket: Ticket): Promise<RuleResponse> => {
            return new Promise<RuleResponse>((resolve) => {
              if (ticket.status.secondary.value === CrmSubStatus.planning) {
                const modal = this.modalService.create({
                  nzTitle: 'Planificar tarea',
                  nzContent: PlanningFormComponent,
                  nzComponentParams: {
                    schema: {
                      properties: {
                        date_start: {
                          title: 'Fecha de inicio',
                          type: 'string',
                          format: 'date',
                          default: ticket.date_start
                        },
                        date_end: {
                          title: 'Fecha de fin',
                          type: 'string',
                          format: 'date',
                          default: ticket.date_end
                        },
                        users: {
                          title: 'Asignado a',
                          type: 'string',
                          default: this.loginService.user.id.toString(),
                          ui: {
                            widget: 'select',
                            asyncData: this.getUsersFunction
                          }
                        }
                      }
                    }
                  },
                  nzOnOk: () => {
                    const planning = modal.getContentComponent().launch();
                    ticket.date_start = planning.date_start;
                    ticket.date_end = planning.date_end;
                    ticket.user.id = planning.users;
                    resolve(<RuleResponse>{
                      resolution: true,
                      error: ''
                    });
                  },
                  nzOnCancel: () => {
                    resolve(<RuleResponse>{
                      resolution: false,
                      error: 'generic error of promise'
                    })
                  }
                });
              } else {
                resolve(<RuleResponse>{
                  resolution: true,
                  error: ''
                })
              }
            })
          }
        ]
      }
    },
    {
      id: 1,
      title: 'Haciendo',
      key: CrmStatus.doing,
      color: 'orange',
      list: [],
      rules: {
        drag: [
          (from: KanbanColum, to: KanbanColum, ticket: Ticket): RuleResponse => {
            if (from.key !== to.key) {
              this.closeImputation();
            }
            return <RuleResponse>{
              resolution: true,
              error: 'La tarea se tiene que pausar antes de pasarla a la columna de haciendo'
            }
          }
        ],
        drop: [
          // si se mueve una tarea a la columna de haciendo y ya existe una, la vieja la trasladará a pausada y a la nueva le creará su registro temporal
          async (from: KanbanColum, to: KanbanColum, ticket: Ticket) => {
            if (to.list.length > 1) {
              const waitingColum: Ticket[] = this.list.find(e => e.key === CrmStatus.waiting).list;
              const ticketToWait: number = to.list.findIndex(e => e.id !== ticket.id);
              to.list[ticketToWait].changeStatus(CrmStatus.waiting, CrmSubStatus.working_time);
              await this.saveTicketStatus(to.list[ticketToWait]);
              transferArrayItem(to.list, waitingColum, ticketToWait, waitingColum.length - 1);
            }
          },
          // Crea una imputacion
          async (from: KanbanColum, to: KanbanColum, ticket: Ticket) => {
            if (from.key !== to.key) {
              await this.createImputation(ticket);
            }
          },
          (from: KanbanColum, to: KanbanColum, ticket: Ticket): void => {
            if (from.key === CrmStatus.todo) {
              this.updateTaskPriorities(from.list);
            }
          }
        ]
      }
    },
    {
      id: 2,
      title: 'Esperando',
      key: CrmStatus.waiting,
      color: 'yellow',
      list: [],
      rules: {
        drag: [
          (from: KanbanColum, to: KanbanColum, ticket: Ticket): RuleResponse => {
            return <RuleResponse>{
              resolution: !(to.key === CrmStatus.todo && ticket.status.secondary.value === CrmSubStatus.working_time),
              error: 'Para reanudar una tarea pendiente ponla directamente en la columna haciendo o cambia el estado para replanificarla'
            }
          },
          (from: KanbanColum, to: KanbanColum, ticket: Ticket): RuleResponse => {
            return <RuleResponse>{
              resolution: !(to.key === CrmStatus.doing && ticket.status.secondary.value !== CrmSubStatus.working_time),
              error: 'Debes arrastar la tarea la columna de Para hacer, de esta manera se replanificará y podrás reanudarla'
            }
          },
        ],
        drop: [
          (from: KanbanColum, to: KanbanColum, ticket: Ticket): Promise<RuleResponse> => new Promise(async (resolve) => {
            if (from.key !== to.key) {
              const modal = this.modalService.create({
                nzTitle: 'Escoge el subestado correcto',
                nzContent: PlanningFormComponent,
                nzComponentParams: {
                  updateSchema: (schema: any, form: any) => {
                    schema.properties.substatus.ui.change = (event) => {
                      if (event === CrmSubStatus.review) {
                        schema.properties = {
                          ...schema.properties,
                          user: {
                            type: 'string',
                            title: 'Revisor',
                            default: this.loginService.user.id.toString(),
                            ui: {
                              widget: 'select',
                              asyncData: this.getUsersFunction
                            }
                          }
                        }
                      } else if (schema.properties['user'] !== undefined) {
                        delete (schema.properties['user']);
                      }
                      schema.properties.substatus.default = event;
                      form.refreshSchema();
                    }
                  },
                  schema: {
                    properties: {
                      substatus: {
                        type: 'string',
                        title: '',
                        enum: statusRelationship[CrmStatus.waiting].substatus.map(e => {
                          const auxRelations = { ...e }
                          delete (auxRelations.color);
                          return auxRelations;
                        }),
                        ui: {
                          widget: 'radio',
                          styleType: 'button',
                          buttonStyle: 'solid',
                          change: undefined
                        },
                        default: CrmSubStatus.working_time
                      },
                    }
                  }
                },
                nzOnOk: () => {
                  const res: any = modal.getContentComponent().launch();
                  ticket.changeStatus(to.key, res.substatus)
                  if (res.user !== undefined) {
                    ticket.responsible = {
                      id: res.user,
                      label: ''
                    }
                  }
                  resolve(<RuleResponse>{
                    resolution: true,
                    error: ''
                  });
                },
                nzOnCancel: () => {
                  resolve(<RuleResponse>{
                    resolution: false,
                    error: 'Operacion cancelada'
                  })
                }
              })
            } else {
              resolve(null)
            }
          }),
          (from: KanbanColum, to: KanbanColum, ticket): void => {
            if (from.key === CrmStatus.todo) {
              this.updateTaskPriorities(from.list);
            }
          }
        ],
        change: [
          (column: KanbanColum, ticket: Ticket): Promise<RuleResponse> => new Promise<RuleResponse>(resolve => {
            ticket.toggleStatus(1);
            if (ticket.status.secondary.value === CrmSubStatus.review) {
              const modal = this.modalService.create({
                nzTitle: 'Seleccione un revisor',
                nzContent: PlanningFormComponent,
                nzComponentParams: {
                  schema: {
                    properties: {
                      users: {
                        type: 'string',
                        title: '',
                        default: this.loginService.user.id.toString(),
                        ui: {
                          widget: 'select',
                          asyncData: this.getUsersFunction
                        }
                      }
                    },
                  }
                },
                nzCancelText: null,
                nzClosable: false,
                nzOnOk: () => {
                  const response = modal.getContentComponent().launch();
                  ticket.responsible = {
                    id: response.user,
                    label: ''
                  }
                  ticket.toggleStatus(-1);
                  resolve(<RuleResponse>{
                    resolution: true,
                    error: ''
                  })
                }
              })
            } else {
              ticket.toggleStatus(-1);
              resolve(<RuleResponse>{
                resolution: true,
                error: ''
              })
            }
          })
        ]
      }
    },
    {
      id: 3,
      title: 'Hecho',
      key: CrmStatus.done,
      color: 'green',
      list: [],
      rules: {
        drag: [
          (from: KanbanColum, to: KanbanColum, ticket: Ticket): RuleResponse => {
            return <RuleResponse>{
              resolution: to.key === CrmStatus.todo,
              error: 'Una tarea que ya fue acabada solo puede restablecerse al estado Retomar'
            }
          }
        ],
        drop: [
          (from: KanbanColum, to: KanbanColum, ticket: Ticket): void => {
            if (from.key === CrmStatus.todo) {
              this.updateTaskPriorities(from.list);
            }
          }
        ]
      }
    }
  ];
  isVisible = false;

  constructor(
    private full: FullContentService,
    public messages: NzMessageService,
    private crm: CrmService,
    private loginService: LoginService,
    private modalService: NzModalService,
    private spinerService: SpinerFactoryService
  ) { }


  async ngOnInit() {
    this.week.start = moment().startOf('isoWeek').add(1, 'day').format('YYYY-MM-DD');
    this.week.end = moment().endOf('isoWeek').format('YYYY-MM-DD');
    this.full.toggle();
    await this.getTasks();
    if (this.loginService.user.preferences.kanban.askForDescription) {
      this.list[1].rules.drop.unshift(
        (from: KanbanColum, to: KanbanColum, ticket: Ticket): Promise<RuleResponse> => new Promise<RuleResponse>(resolve => {
          const modal = this.modalService.create({
            nzTitle: 'Comentario para la imputacion',
            nzContent: PlanningFormComponent,
            nzComponentParams: {
              schema: {
                properties: {
                  comment: {
                    title: 'Descripción',
                    type: 'string'
                  }
                }
              }
            },
            nzOnOk: () => {
              this.currentImputation.description = <string>modal.getContentComponent().launch()['comment'];
              this.saveImputationStatus();
              resolve(<RuleResponse>{
                resolution: true,
                data: modal.getContentComponent().launch()
              });
            },
            nzOnCancel: () => {
              resolve(<RuleResponse>{
                error: 'Mensaje genérico',
              })
            }
          })
        })
      )
    };
    this.users = await this.crm.getLists(Modules.formulario_atencion_telefonica, {
      params: {
        modules: [Modules.usuarios]
      }
    }).toPromise();
    this.showCrono = this.list[1].list.length > 0;
  }

  /**
   * Obtiene las tareas y si existe una imputacion en curso
   */
  async getTasks() {
    const params: object = { users: [this.selectedUser] };
    const toShow = await this.crm.getLists(Modules.kanban, {
      params: {
        modules: [Modules.tareas, Modules.incidencias, Modules.actividades],
        date_start: this.week.start,
        date_end: this.week.end,
        continued: false,
        ...params
      }
    }).pipe(
      // FIXME: eliminar filtro
      map(e => e.filter(y => y.status.main.value !== CrmSubStatus.canceled && y.parent.length > 0).map(y => new Ticket(y))),
    ).toPromise();
    [CrmStatus.todo, CrmStatus.doing, CrmStatus.waiting, CrmStatus.done].forEach((e, i) => {
      this.list[i].list = toShow.filter((y: Ticket) => y.status.main.value === e);
    });
    await this.crm.getLists(Modules.kanban, {
      params: {
        modules: [Modules.imputaciones],
        date_start: moment().format('YYYY-MM-DD'),
        date_end: moment().format('YYYY-MM-DD'),
        ...params
      }
    }).pipe(
      map(res => res.map(e => new Imputation(e))),
      tap(res => {
        this.currentImputation = res.find((e: Imputation) => moment(e.date_start).isSame(e.date_end));
        if (this.currentImputation) {
          const difference: number = moment().diff(this.currentImputation.date_end, 'seconds');
          this.initCronoValue = decimalToSexagesimal(difference);
        }
      })
    ).toPromise();
    this.list[0].list.sort((a: Ticket, b: Ticket) => a.priority.order - b.priority.order);
  }

  /**
   * Obtiene las tareas del usuario especificado
   */
  async changeUser() {
    this.spinerService.show();
    await this.getTasks();
    this.spinerService.hide();
  }

  async drop(event: any, toColumn: KanbanColum) {
    const ticketId = +event.item.element.nativeElement.querySelector('#id').innerText; // Id de la tarea movida
    const previousColumnId = +event.previousContainer.id.substr(-1);
    const fromColumn = this.list.find(e => e.id === previousColumnId);
    const actualTicket: Ticket = this.list[previousColumnId].list.find((e: Ticket) => e.id === ticketId);

    // drag rules
    if (fromColumn.rules !== null) {
      let counter = 0;
      while (counter < fromColumn.rules.drag.length) {
        const rule = fromColumn.rules.drag[counter];
        const response: RuleResponse = await rule(fromColumn, toColumn, actualTicket);
        if (!response.resolution) {
          this.messages.error(response.error);
          return;
        }
        counter++;
      }
    }

    if (fromColumn.key !== toColumn.key) {
      actualTicket.changeStatus(toColumn.key);
    }

    if (event.previousContainer === event.container) {
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
    } else {
      transferArrayItem(event.previousContainer.data, event.container.data, event.previousIndex, event.currentIndex);
    }

    // drop rules
    if (toColumn.rules !== null && toColumn.rules.drop !== undefined) {
      toColumn.rules.drop.forEach(async (rule) => {
        await rule(fromColumn, toColumn, actualTicket);
      })
    }
    this.saveTicketStatus(actualTicket);
  }

  /**
   * Guarda el estado actual de un ticket concreto
   * @param actualTicket ticket a actualizar
   */
  async saveTicketStatus(actualTicket: Ticket) {
    try {
      await this.crm.createRecord(Modules.kanban, actualTicket.export()).toPromise();
    } catch (error) {
      console.error(error);
      this.messages.error('Fallo al modificar el estado');
    }
  }

  /**
   * Modifica el subestado de las tareas
   * @param column columna en la que se encuentra la tarea
   * @param ticket tarea en cuestion
   */
  async changeSubStatus(column: KanbanColum, ticket: Ticket) {
    if (column.rules !== null && column.rules.change !== undefined) {
      let counter = 0;
      while (counter < column.rules.change.length) {
        const rule = column.rules.change[counter];
        const response: RuleResponse = await rule(column, ticket) || null;
        if (response && !response.resolution) {
          this.messages.error(response.error);
          return;
        }
        counter++;
      }
    }
    ticket.toggleStatus(1);
    this.saveTicketStatus(ticket);
  }

  /**
   * Crea una nueva tarea en el crm
   */
  createTask() {
    window.open(`${environment.domain}/crm/index.php?module=ProjectTask&view=Edit&userid=${this.loginService.user.id}&usertoken=${this.loginService.usertoken}`, '_target');
  }

  /**
   * Cierra la imputacion abierta
   */
  async closeImputation() {
    console.log('cerrando imputacion');
    this.currentImputation.date_end = new Date();
    try {
      await this.crm.createRecord(Modules.kanban, this.currentImputation.export()).toPromise();
      this.showCrono = false;
      this.currentImputation = null;
    } catch (error) {
      console.error(error);
    }
  }


  /**
   * Actualiza el estado de la imputacion en curso
   * (se usa para actualizar la descripcion)
   */
  async saveImputationStatus() {
    try {
      await this.crm.createRecord(Modules.kanban, this.currentImputation.export()).toPromise();
    } catch (error) {
      console.error(error);
      this.messages.error('No se pudo actualizar la imputacion')
    }
  }
  /**
   * Genera una imputacion para un elemento concreto
   * @param ticket elemento al que asignar la imputacion
   */
  async createImputation(ticket: Ticket) {
    console.log('Creando imputacion');
    if (this.currentImputation) {
      await this.closeImputation();
    }
    this.currentImputation = new Imputation({
      name: 'imputacion kanban',
      description: 'creado desde kanban',
      date_start: moment().format('YYYY-MM-DD'),
      date_end: moment().format('YYYY-MM-DD'),
      time_start: moment().format('HH:mm:ss'),
      time_end: moment().format('HH:mm:ss'),
      user: {
        id: this.loginService.user.id,
        label: this.loginService.user.name
      },
      parent: [
        {
          id: ticket.id,
          label: ticket.name,
          mod: ticket.mod,
          responsible: ticket.responsible,
          status: {
            main: {
              value: ticket.status.main.value
            },
            secondary: {
              label: ticket.status.secondary.label,
              value: ticket.status.secondary.value
            }
          }
        }
      ]
    });
    try {
      await this.crm.createRecord(Modules.kanban, this.currentImputation.export()).pipe(
        tap(res => {
          this.currentImputation.id = res.result;
        })
      ).toPromise();
      this.showCrono = true;
      this.initCronoValue = '00:00:00';
    } catch (error) {
      console.error(error);
    }
  }

  /**
   * Abre el detalle de la tarea especificada en el crm
   * @param ticket tarea a abrir
   */
  openInCrm(ticket: Ticket) {
    this.crm.openDetails(ticket.mod, ticket.id, this.loginService.user.id, this.loginService.usertoken);
  }

  /**
   * Actualiza las prioridades de las tareas en el servidor
   * @param list tareas que actualizar
   */
  updateTaskPriorities(list: Ticket[]) {
    list.forEach((e: Ticket, i: number) => {
      e.priority.order = i;
      this.saveTicketStatus(e);
    });
  }

  /**
   * Interfaz para actualizar la prioridad de una tarea
   * @param actualIndex indice actual en el array
   */
  async updatePriority(actualIndex: number) {
    try {
      const newIndex: number = await new Promise<number>((resolve, reject) => {
        const modal = this.modalService.create({
          nzTitle: 'Asignar prioridad',
          nzContent: PlanningFormComponent,
          nzComponentParams: {
            schema: {
              properties: {
                new_index: {
                  title: 'Nueva prioridad ',
                  type: 'integer',
                  minimum: 1
                }
              }
            }
          },
          nzOnOk: () => {
            const planning = modal.getContentComponent().launch();
            const aux = --planning.new_index;
            if (!isNaN(aux)) {
              resolve(aux);
            } else {
              reject({ error: true, message: 'La prioridad ha de especificarse de forma numérica' });
            }
          },
          nzOnCancel: () => {
            reject({ error: false, message: 'Cambio de prioridad cancelado' });
          },

        })
      });
      moveItemInArray(this.list[0].list, actualIndex, newIndex);
      this.updateTaskPriorities(this.list[0].list);
    } catch (error) {
      console.log(error);
      this.messages[error.error ? 'error' : 'warning'](error.message);
    }
  }

  async changeWeek() {
    this.week.start = moment(this.week.date).startOf('isoWeek').format('YYYY-MM-DD');
    this.week.end = moment(this.week.date).endOf('isoWeek').format('YYYY-MM-DD');
    this.spinerService.show();
    await this.getTasks();
    this.spinerService.hide();
  }
}
