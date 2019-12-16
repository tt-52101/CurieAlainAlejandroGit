export enum CrmStatus {
  sin_planear = 'PLL_PTE_PLANIFICAR',
  planeado = 'PLL_PLANNED',
  hoy = 'PLL_HOY',
  en_progreso = 'PLL_IN_REALIZATION',
  pospuesto = 'PLL_POSTPONED',
  pte_tercero = 'PLL_PTE_TERCERO',
  completado = 'PLL_COMPLETED',
  cancelado = 'PLL_CANCELLED',
  caducado_atrasado = 'PLL_OVERDUE'
}

export enum StatusColors {
  'Pte. Planificar' = 'gray',
  'Planificada' = 'yellow',
  'En tiempo' = 'green',
  'Atrasada' = 'red',
  'Pausada' = 'orange',
  'Pte. Revisión' = 'blue',
  'Realizada' = 'darkgreen',
  'Cancelada' = 'darkred',
}

export const statusRelationship = {
  todo: [
    {
      label: 'Planeando',
      value: CrmStatus.planeado,
      color: 'yellow'
    },
    {
      label: 'Pte. planificar',
      value: CrmStatus.sin_planear,
      color: 'gray'
    },
    {
      label: 'Hoy',
      value: CrmStatus.hoy,
      color: 'lightgreen'
    }
  ],
  doing: [
    {
      label: 'En progreso',
      value: CrmStatus.en_progreso,
      color: 'green'
    },
    {
      label: 'Atrasado',
      value: CrmStatus.caducado_atrasado,
      color: 'red'
    },
    {
      label: 'Caducado',
      value: CrmStatus.caducado_atrasado,
      color: 'darkorange'
    }
  ],
  paused: [
    {
      label: 'Pospuesto',
      value: CrmStatus.pospuesto,
      color: 'blue'
    },
    {
      label: 'Pte. tercero',
      value: CrmStatus.pte_tercero,
      color: 'orange'
    }
  ],
  done: [
    {
      label: 'Completado',
      value: CrmStatus.completado,
      color: 'darkgreen'
    },
    {
      label: 'Cancelado',
      value: CrmStatus.cancelado,
      color: 'darkred'
    }
  ]
}
