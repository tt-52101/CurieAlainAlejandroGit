export enum CrmStatus {
  todo = 'PLL_TODO',
  doing = 'PLL_DOING',
  waiting = 'PLL_WAITING',
  done = 'PLL_DONE'
}
export enum CrmSubStatus {
  planning = 'PLL_PLANNING',
  planned = 'PLL_PLANNED',
  resume = 'PLL_RESUME',
  working_time = 'PLL_WORKING_TIME',
  review = 'PLL_REVIEW',
  third_party = 'PLL_THIRD_PARTY',
  priority = 'PLL_PRIORITY',
  completed = 'PLL_COMPLETED',
  canceled = 'PLL_CANCELED'
}

export const colors = {
  [CrmStatus.todo]: '',
  [CrmStatus.doing]: 'green',
  [CrmStatus.waiting]: '',
  [CrmStatus.done]: '',
  [CrmSubStatus.planning]: 'gray',
  [CrmSubStatus.planned]: 'yellow',
  [CrmSubStatus.resume]: 'lightgreen',
  [CrmSubStatus.working_time]: 'lightblue',
  [CrmSubStatus.review]: 'blue',
  [CrmSubStatus.third_party]: 'orange',
  [CrmSubStatus.priority]: 'volcano',
  [CrmSubStatus.completed]: 'darkgreen',
  [CrmSubStatus.canceled]: 'darkred',
}

export const statusRelationship = {
  [CrmStatus.todo]: {
    label: 'Para hacer',
    substatus: [
      {
        label: 'Planificando',
        value: CrmSubStatus.planning,
        color: colors[CrmSubStatus.planning]
      },
      {
        label: 'Planificada',
        value: CrmSubStatus.planned,
        color: colors[CrmSubStatus.planned]
      },
      {
        label: 'Retomar',
        value: CrmSubStatus.resume,
        color: colors[CrmSubStatus.resume]
      }
    ]
  },
  [CrmStatus.doing]: {
    label: 'Haciendo',
    substatus: [
      {
        label: 'Haciendo',
        value: CrmStatus.doing,
        color: colors[CrmStatus.doing]
      }
    ]
  },
  [CrmStatus.waiting]: {
    label: 'Esperando',
    substatus: [
      {
        label: 'Fin jornada',
        value: CrmSubStatus.working_time,
        color: colors[CrmSubStatus.working_time]
      },
      {
        label: 'Revisión',
        value: CrmSubStatus.review,
        color: colors[CrmSubStatus.review]
      },
      {
        label: 'Terceros',
        value: CrmSubStatus.third_party,
        color: colors[CrmSubStatus.third_party]
      },
      {
        label: 'Prioridad',
        value: CrmSubStatus.priority,
        color: colors[CrmSubStatus.priority]
      },
    ]
  },
  [CrmStatus.done]: {
    label: 'Hecho',
    substatus: [
      {
        label: 'Completada',
        value: CrmSubStatus.completed,
        color: colors[CrmSubStatus.completed]
      },
      {
        label: 'Cancelada',
        value: CrmSubStatus.canceled,
        color: colors[CrmSubStatus.canceled]
      },
    ]
  }
}
