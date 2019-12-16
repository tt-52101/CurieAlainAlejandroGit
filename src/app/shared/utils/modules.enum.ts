/**
 * Nombres de los modulos del crm
 */
/**
 * Nombres de los modulos del crm
 */
export enum Modules {
  encuestas = 'IPreguntas',
  respuestas = 'IRespuestas',
  incidencias = 'HelpDesk',
  productos = 'Products',
  usuarios = 'Users',
  coches = 'CFixedAssets',
  pedidos = 'SVendorEnquiries',
  maquinas = 'Assets',
  clustering = 'Clustering',
  user_clustering = 'Users',
  kanban = 'Kanban',
  tareas = 'ProjectTask',
  actividades = 'Calendar',
  imputaciones = 'OSSTimeControl',
  formulario_atencion_telefonica = 'KanbanData',
  contratos = 'ServiceContracts',
  contactos = 'Contacts',
  nueva_incidencia = 'HelpDesk',
  clientes = 'Accounts',
  plantillas = 'EmailTemplates',
  modulos = "Modules",
  fields = "Fields"
}

/**
 * Relación entre los módulos del crm y su correspondiente endpoint
 */
export const endPointExclusions = {
  get: {
    Clustering: '',
    Kanban: '',
    KanbanData: '',
    Users: 'Clustering',
    EmailTemplates: 'Templates',
    Modules: '',
    Fields: '',
    default: 'RecordsList'
  },
  post: {
    Users: 'Clustering',
    Kanban: '',
    default: 'Record'
  },
  put: {
    Users: 'Clustering',
    Kanban: '',
    default: 'Record'
  },
  delete: {
    Users: 'Clustering',
    Kanban: '',
    default: 'Record'
  }
};
