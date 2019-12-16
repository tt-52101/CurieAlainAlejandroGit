/*
 * Definición de los tipos de respuestas
 */
export const Types = [
  {
    campo: 'text',
    img: '../../assets/form-build/respuestacorta.svg',
    properties: {
      name: {
        type: 'string',
        title: 'Escribe tu pregunta',
        default: '',
        value: '',
        ui: {
          placeholder: '¿Cuál es tu nombre?',
        },
      },
      required: {
        type: 'boolean',
        title: 'Obligatorio',
        default: false,
        value: false,
        ui: {
          widget: 'checkbox',
        },
      },
      placeholder: {
        type: 'string',
        title: 'Texto de ayuda',
        default: '',
        value: '',
        ui: {
          placeholder: '',
        },
      },
      descripcion: {
        type: 'string',
        title: 'Descripción de la pregunta',
        default: '',
        value: '',
        ui: {
          placeholder: '',
        },
      },
      validation: {
        type: 'string',
        title: 'Validaciones',
        default: '',
        value: '',
        ui: {
          widget: 'select',
          showSearch: true,
          
        }
      },
     /* errormessage: {
        type: 'string',
        title: 'Mensaje de error',
        default: '',
        ui: {
          placeholder: '',
        },
      },*/
    },
  },
  {
    campo: 'textarea',
    img: '../../assets/form-build/parrafo.svg',
    properties: {
      name: {
        type: 'string',
        title: 'Escribe tu pregunta',
        default: '',
        ui: {
          placeholder: '¿Cuál es tu nombre?',
        },
      },
      required: {
        type: 'boolean',
        title: 'Obligatorio',
        default: false,
        value: false,
        ui: {
          widget: 'checkbox',
        },
      },
      placeholder: {
        type: 'string',
        title: 'Texto de ayuda',
        default: '',
        ui: {
          placeholder: '',
        },
      },
      errormessage: {
        type: 'string',
        title: 'Mensaje de error',
        default: '',
        ui: {
          placeholder: '',
        },
      },
    },
  },
  {
    campo: 'radiobutton',
    img: '../../assets/form-build/seleccionmultiple.svg',
    properties: {
      name: {
        type: 'string',
        title: 'Escribe tu pregunta',
        default: '',
        ui: {
          placeholder: '¿Cuál es tu nombre?',
        },
      },
      required: {
        type: 'boolean',
        title: 'Obligatorio',
        default: false,
        value: false,
        ui: {
          widget: 'checkbox',
        },
      },
      placeholder: {
        type: 'string',
        title: 'Texto de ayuda',
        default: '',
        ui: {
          placeholder: '',
        },
      },
      errormessage: {
        type: 'string',
        title: 'Mensaje de error',
        default: '',
        ui: {
          placeholder: '',
        },
      },
    },
  },
  {
    campo: 'checkbox',
    img: '../../assets/form-build/casillaverificacion.svg',
    properties: {
      name: {
        type: 'string',
        title: 'Escribe tu pregunta',
        default: '',
        ui: {
          placeholder: '¿Cuál es tu nombre?',
        },
      },
      required: {
        type: 'boolean',
        title: 'Obligatorio',
        default: false,
        value: false,
        ui: {
          widget: 'checkbox',
        },
      },
      placeholder: {
        type: 'string',
        title: 'Texto de ayuda',
        default: '',
        ui: {
          placeholder: '',
        },
      },
      errormessage: {
        type: 'string',
        title: 'Mensaje de error',
        default: '',
        ui: {
          placeholder: '',
        },
      },
    },
  },
  {
    campo: 'select',
    img: '../../assets/form-build/desplegable.svg',
    properties: {
      name: {
        type: 'string',
        title: 'Escribe tu pregunta',
        default: '',
        ui: {
          placeholder: '¿Cuál es tu nombre?',
        },
      },
      required: {
        type: 'boolean',
        title: 'Obligatorio',
        default: false,
        value: false,
        ui: {
          widget: 'checkbox',
        },
      },
      placeholder: {
        type: 'string',
        title: 'Texto de ayuda',
        default: '',
        ui: {
          placeholder: '',
        },
      },
      errormessage: {
        type: 'string',
        title: 'Mensaje de error',
        default: '',
        ui: {
          placeholder: '',
        },
      },
    },
  },
  {
    campo: 'upload',
    img: '../../assets/form-build/subirarchivos.svg',
    properties: {
      name: {
        type: 'string',
        title: 'Escribe tu pregunta',
        default: '',
        ui: {
          placeholder: '¿Cuál es tu nombre?',
        },
      },
      required: {
        type: 'boolean',
        title: 'Obligatorio',
        default: false,
        value: false,
        ui: {
          widget: 'checkbox',
        },
      },
      placeholder: {
        type: 'string',
        title: 'Texto de ayuda',
        default: '',
        ui: {
          placeholder: '',
        },
      },
      errormessage: {
        type: 'string',
        title: 'Mensaje de error',
        default: '',
        ui: {
          placeholder: '',
        },
      },
    },
  },
  {
    campo: 'number',
    img: '../../assets/form-build/numeros.svg',
    properties: {
      name: {
        type: 'string',
        title: 'Escribe tu pregunta',
        default: '',
        ui: {
          placeholder: '¿Cuál es tu nombre?',
        },
      },
      required: {
        type: 'boolean',
        title: 'Obligatorio',
        default: false,
        value: false,
        ui: {
          widget: 'checkbox',
        },
      },
      placeholder: {
        type: 'string',
        title: 'Texto de ayuda',
        default: '',
        ui: {
          placeholder: '',
        },
      },
      errormessage: {
        type: 'string',
        title: 'Mensaje de error',
        default: '',
        ui: {
          placeholder: '',
        },
      },
    },
  },
  {
    campo: 'date',
    img: '../../assets/form-build/fecha.svg',
    properties: {
      name: {
        type: 'string',
        title: 'Escribe tu pregunta',
        default: '',
        ui: {
          placeholder: '¿Cuál es tu nombre?',
        },
      },
      required: {
        type: 'boolean',
        title: 'Obligatorio',
        default: false,
        value: false,
        ui: {
          widget: 'checkbox',
        },
      },
      placeholder: {
        type: 'string',
        title: 'Texto de ayuda',
        default: '',
        ui: {
          placeholder: '',
        },
      },
      errormessage: {
        type: 'string',
        title: 'Mensaje de error',
        default: '',
        ui: {
          placeholder: '',
        },
      },
    },
  },
  {
    campo: 'time',
    img: '../../assets/form-build/hora.svg',
    properties: {
      name: {
        type: 'string',
        title: 'Escribe tu pregunta',
        default: '',
        ui: {
          placeholder: '¿Cuál es tu nombre?',
        },
      },
      required: {
        type: 'boolean',
        title: 'Obligatorio',
        default: false,
        value: false,
        ui: {
          widget: 'checkbox',
        },
      },
      placeholder: {
        type: 'string',
        title: 'Texto de ayuda',
        default: '',
        ui: {
          placeholder: '',
        },
      },
      errormessage: {
        type: 'string',
        title: 'Mensaje de error',
        default: '',
        ui: {
          placeholder: '',
        },
      },
    },
  },
];


/* EJEMPLOS DE ESQUEMAS (PARA PRUEBAS)
 schema: SFSchema = {
  properties: {
    title: {
      type: 'string',
      title: 'Título',
      default: this.title,
      ui: {
        placeholder: 'Escribe un título'
      }
    },
    descripcion: {
      type: 'string',
      title: 'Descripción',
      default: this.descricpion,
      ui: { 
        widget: 'textarea',
        autosize: { minRows: 6, maxRows: 10 },
        placeholder: 'Escribe una descricpión',
      }
    },
    categoria: {
      type: 'string',
      title: 'Categoría',
      default: this.categoria,
      ui: {
        widget: 'select',
        showSearch: true,
      }
    },   
  },
}



schemaText: SFSchema = {
  properties: {
    name: {
        type: 'string',
        title: 'Escribe tu pregunta',
        default: '',
        ui: {
          placeholder: '¿Cuál es tu nombre?',
        }
    },
    placeholder: {
      type: 'string',
      title: 'Texto de ayuda',
      default: '',
      ui: {
        placeholder: ''
      }
    },
    required: {
      type: 'boolean',
      title: 'Obligatorio',
      default: false,
      ui: {
        widget: 'checkbox',
      }
    },
    errormessage: {
      type: 'string',
      title: 'Mensaje de error',
      default: '',
      ui: {
        placeholder: ''
      }
    },
    modulo: {
      type: 'string',
      title: 'Importar campos de un módulo',
      default: '',
      ui: {
        widget: 'select',
        showSearch: true,
        asyncData: () =>
          of([
            {
              label: 'Seleccionar módulo',
              group: true,
              children: this.modulos,
            },
          ]).pipe(delay(1200)),
      }
    },   
}
}
*/