export const nodeTypes = ["Acciones", "Eventos"];
export const nodeSubTypes = [
  {
    shortName: "SendEmail",
    name: "Enviar correo",
    description: "Envia un correo a una lista de leads",
    icon: "\uf0e0",
    type: "Acciones",
    properties: {
      delay_value: {
        value: 0,
        title: "Tiempo de espera",
        type: "number",
        minimum: 0,
        ui: {
          placeholder: 0,
          unit: 'dias'
        }
      },
      delay_unit: {
        value: "dias",
        title: "Unidad de tiempo",
        type: "string",
        enum: [
          {label: "Minutos", value: "minutos"},
          {label: "Horas", value: "horas"},
          {label: "Días", value: "dias"},
          {label: "Meses", value: "meses"},
          {label: "Años", value: "años"},
        ],
        ui: {
          optionalHelp: "Unidad de tiempo para el retraso en la ejecution de los nodos.",
          placeholder: "Seleccione una unidad de tiempo.",
          widget: 'select',
          change: undefined
        }
      },
      mail_id: {
        value: -1,
        title: "Email a enviar",
        type: "string",
        enum: [],
        ui: {
          optionalHelp: "Seleccione template de email a enviar",
          placeholder: "Plantilla de email",
          widget: 'select'
        }
      }
    }
  },
  {
    shortName: "UpdateLead",
    name: "Actualizar puntuacion de lead",
    description: "Actualiza la puntuacion de un lead",
    icon: "\uf201",
    type: "Acciones",
    properties: {
      delay_value: {
        value: 0,
        title: "Tiempo de espera",
        type: "number",
        minimum: 0,
        ui: {
          placeholder: 0,
          unit: 'dias'
        }
      },
      delay_unit: {
        value: "dias",
        title: "Unidad de tiempo",
        type: "string",
        enum: [
          {label: "Minutos", value: "minutos"},
          {label: "Horas", value: "horas"},
          {label: "Días", value: "dias"},
          {label: "Meses", value: "meses"},
          {label: "Años", value: "años"},
        ],
        ui: {
          optionalHelp: "Unidad de tiempo para el retraso en la ejecution de los nodos.",
          placeholder: "Seleccione una unidad de tiempo.",
          widget: 'select',
          change: undefined
        }
      },
      score: {
        value: 0,
        title: "Puntuacion",
        type: "number",
        ui: {
          optionalHelp: "Actualiza la puntuacion de un lead",
          placeholder: "Puntuación a sumar"
        }
      },
    }
  },
  {
    shortName: "UpdateField",
    name: "Actualizar campo",
    description: "Actualiza el campo de un módulo asociado.",
    icon: "\uf044",
    type: "Acciones",
    properties: {
      delay_value: {
        value: 0,
        title: "Tiempo de espera",
        type: "number",
        minimum: 0,
        ui: {
          placeholder: 0,
          unit: 'dias'
        }
      },
      delay_unit: {
        value: "dias",
        title: "Unidad de tiempo",
        type: "string",
        enum: [
          {label: "Minutos", value: "minutos"},
          {label: "Horas", value: "horas"},
          {label: "Días", value: "dias"},
          {label: "Meses", value: "meses"},
          {label: "Años", value: "años"},
        ],
        ui: {
          optionalHelp: "Unidad de tiempo para el retraso en la ejecution de los nodos.",
          placeholder: "Seleccione una unidad de tiempo.",
          widget: 'select',
          change: undefined
        }
      },
      module_id: {
        value: "",
        title: "Módulo",
        type: "string",
        enum: [],
        ui: {
          change: undefined,
          optionalHelp: "Módulo del campo a actualizar",
          placeholder: "Seleccione plantilla de email",
          widget: 'select'
        }
      },
      field_id: {
        value: "",
        title: "Campo",
        type: "string",
        enum: [],
        ui: {
          change: undefined,
          optionalHelp: "Campo a actualizar",
          placeholder: "Seleccione campo",
          widget: 'select'
        }
      },
      input_value: {
        value: "",
        title: "Valor a introducir",
        type: "string",
        enum: undefined,
        ui: {
          optionalHelp: "Valor a introducir para modificar el registro",
          placeholder: "Valor",
          widget: undefined
        }
      },
    }
  },
  {
    shortName: "AddToSegment",
    name: "Añadir a segmento",
    description: "Añade el lead a un nuevo segmento (sin eliminarlo del actual)",
    icon: "\uf234",
    type: "Acciones",
    properties: {
      delay_value: {
        value: 0,
        title: "Tiempo de espera",
        type: "number",
        minimum: 0,
        ui: {
          placeholder: 0,
          unit: 'dias'
        }
      },
      delay_unit: {
        value: "dias",
        title: "Unidad de tiempo",
        type: "string",
        enum: [
          {label: "Minutos", value: "minutos"},
          {label: "Horas", value: "horas"},
          {label: "Días", value: "dias"},
          {label: "Meses", value: "meses"},
          {label: "Años", value: "años"},
        ],
        ui: {
          optionalHelp: "Unidad de tiempo para el retraso en la ejecution de los nodos.",
          placeholder: "Seleccione una unidad de tiempo.",
          widget: 'select',
          change: undefined
        }
      },
      segment_id: {
        value: "",
        title: "Segmento",
        type: "string",
        enum: [],
        ui: {
          optionalHelp: "Segmento donde añadir al lead",
          placeholder: "Segmento a seleccionar",
          widget: 'select'
        }
      },
    }
  },
  {
    shortName: "RemoveFromSegment",
    name: "Eliminar del segmento",
    description: "Quita al lead del segmento actual",
    icon: "\uf235",
    type: "Acciones",
    properties: {
      delay_value: {
        value: 0,
        title: "Tiempo de espera",
        type: "number",
        minimum: 0,
        ui: {
          placeholder: 0,
          unit: 'dias'
        }
      },
      delay_unit: {
        value: "dias",
        title: "Unidad de tiempo",
        type: "string",
        enum: [
          {label: "Minutos", value: "minutos"},
          {label: "Horas", value: "horas"},
          {label: "Días", value: "dias"},
          {label: "Meses", value: "meses"},
          {label: "Años", value: "años"},
        ],
        ui: {
          optionalHelp: "Unidad de tiempo para el retraso en la ejecution de los nodos.",
          placeholder: "Seleccione una unidad de tiempo.",
          widget: 'select',
          change: undefined
        }
      },
      segment_id: {
        value: "",
        title: "Segmento",
        type: "string",
        enum: [],
        ui: {
          optionalHelp: "Segmento donde eliminar al lead",
          placeholder: "Segmento a seleccionar",
          widget: 'select'
        }
      },
    }
  },
  {
    shortName: "EmailOpened",
    name: "Email abierto",
    description: "El email enviado ha sido abierto",
    icon: "\uf2b6",
    type: "Eventos",
    properties: {
      delay_value: {
        value: 0,
        title: "Tiempo de espera",
        type: "number",
        minimum: 0,
        ui: {
          placeholder: 0,
          unit: 'dias'
        }
      },
      delay_unit: {
        value: "dias",
        title: "Unidad de tiempo",
        type: "string",
        enum: [
          {label: "Minutos", value: "minutos"},
          {label: "Horas", value: "horas"},
          {label: "Días", value: "dias"},
          {label: "Meses", value: "meses"},
          {label: "Años", value: "años"},
        ],
        ui: {
          optionalHelp: "Unidad de tiempo para el retraso en la ejecution de los nodos.",
          placeholder: "Seleccione una unidad de tiempo.",
          widget: 'select',
          change: undefined
        }
      },
      mail_id: {
        value: -1,
        title: "Email a enviar",
        type: "string",
        enum: [],
        ui: {
          optionalHelp: "Seleccione template de email a enviar",
          placeholder: "Plantilla de email",
          widget: 'select'
        }
      }
    }
  },
  {
    shortName: "Birthday",
    name: "Cumpleaños",
    description: "Se produce el cumpleaños de un lead",
    icon: "\uf1fd",
    type: "Eventos",
    properties: {
      delay_value: {
        value: 0,
        title: "Tiempo de espera",
        type: "number",
        minimum: 0,
        ui: {
          placeholder: 0,
          unit: 'dias'
        }
      },
      delay_unit: {
        value: "dias",
        title: "Unidad de tiempo",
        type: "string",
        enum: [
          {label: "Minutos", value: "minutos"},
          {label: "Horas", value: "horas"},
          {label: "Días", value: "dias"},
          {label: "Meses", value: "meses"},
          {label: "Años", value: "años"},
        ],
        ui: {
          optionalHelp: "Unidad de tiempo para el retraso en la ejecution de los nodos.",
          placeholder: "Seleccione una unidad de tiempo.",
          widget: 'select',
          change: undefined
        }
      },
    }
  },
  {
    shortName: "True",
    name: "Condición cumplida",
    description: "Se cumple la condicion del evento previo",
    icon: "si",
    type: "True"
  },
  {
    shortName: "False",
    name: "Condición no cumplida",
    description:
      "No cumple la condicion del evento previo o se acaba el tiempo de respuesta",
    icon: "no",
    type: "False"
  },
  {
    shortName: "CheckFieldValue",
    name: "Comprobar valor de un campo",
    description:
      "Comprueba si un campo de un módulo cumple un determinado valor",
    icon: "\uf059",
    type: "Eventos",
    properties: {
      delay_value: {
        value: 0,
        title: "Tiempo de espera",
        type: "number",
        minimum: 0,
        ui: {
          placeholder: 0,
          unit: 'dias'
        }
      },
      delay_unit: {
        value: "dias",
        title: "Unidad de tiempo",
        type: "string",
        enum: [
          {label: "Minutos", value: "minutos"},
          {label: "Horas", value: "horas"},
          {label: "Días", value: "dias"},
          {label: "Meses", value: "meses"},
          {label: "Años", value: "años"},
        ],
        ui: {
          optionalHelp: "Unidad de tiempo para el retraso en la ejecution de los nodos.",
          placeholder: "Seleccione una unidad de tiempo.",
          widget: 'select',
          change: undefined
        }
      },
      module_id: {
        value: "",
        title: "Módulo",
        type: "string",
        enum: [],
        ui: {
          change: undefined,
          optionalHelp: "Módulo del campo a actualizar",
          placeholder: "Módulo a seleccionar",
          widget: 'select'
        },
        default: ''
      },
      field_id: {
        value: "",
        title: "Campo",
        type: "string",
        enum: [],
        ui: {
          change: undefined,
          optionalHelp: "Campo a actualizar",
          placeholder: "Seleccionar campo",
          widget: 'select'
        }
      },
      condition: {
        value: "",
        title: "Tipo de condición",
        type: "string",
        enum: [
          {label: "Igual que", value: "=="},
          {label: "Distinto que", value: "!="},
          {label: "Menor que", value: "<"},
          {label: "Mayor que", value: ">"},
          {label: "Menor o igual que", value: "<="},
          {label: "Mayor o igual que", value: ">="},
        ],
        ui: {
          optionalHelp: "Condicion a utilizar",
          placeholder: "Seleccione condición",
          widget: 'select'
        }
      },
      input_value: {
        value: "",
        title: "Valor esperado",
        description: "Valor esperado para ver si se cumple o no la condicion",
        type: "string",
        ui: {
          optionalHelp: "Valor esperado",
          placeholder: "Escriba el valor a comparar",
          widget: 'select'
        },
      },
    }
  },
];
