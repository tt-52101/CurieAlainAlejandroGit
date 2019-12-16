import { MockRequest } from '@delon/mock';
import { Ticket } from '@shared/models/Ticket';

const tickets = [
  {
    id: 0,
    assignedTask: 121,
    title: 'App klingele caida',
    description: 'Se rompio el crm',
    start: '2019-07-02T10:00:00Z',
    end: '2019-07-02T13:00:00Z'
  }, {
    id: 1,
    assignedTask: 190,
    title: 'Aprendiendo angular',
    description: 'Usando angular y typescript',
    start: '2019-07-02T10:00:00Z',
    end: '2019-07-02T13:00:00Z'
  }
];

const _tasks = [
  {
    id: 1912,
    project: 'klingele',
    name: 'App klingele caída',
    description: 'lorem impsum dolor at tae',
    status: {
      main: 'todo',
      secondary: null
    },
    maxDate: '2019-07-15T00:00:00Z'
  },
  {
    id: 1957,
    project: 'Continuos',
    name: 'Gestión del conocimiento',
    description: 'lorem impsum dolor at tae',
    status: {
      main: 'paused',
      secondary: 'Pausada'
    },
    maxDate: '2019-07-15T00:00:00Z',
  },
  {
    id: 1922,
    project: 'Continuos',
    name: 'Desayuno',
    description: 'lorem impsum dolor at tae',
    status: {
      main: 'done',
      secondary: 'Realizada'
    },
    maxDate: '2019-07-15T00:00:00Z'
  },
  {
    id: 1910,
    name: 'Incidencia',
    project: 'GestionCar',
    description: 'lorem impsum dolor at tae',
    status: {
      main: 'doing',
      secondary: 'Atrasada'
    },
    maxDate: '2019-07-15T00:00:00Z'
  },
  {
    id: 1952,
    name: 'Varios',
    project: 'Continuos',
    description: 'lorem impsum dolor at tae',
    status: {
      main: 'todo',
      secondary: 'Pte. Planificar'
    },
    maxDate: '2019-07-15T00:00:00Z'
  }
];

const usuarios = [
  {
    name: 'Mario',
    roles: [
      'developer'
    ]
  },
  {
    name: 'Ayoze',
    roles: [
      'developer'
    ]
  },
  {
    name: 'Carlos',
    roles: [
      'developer'
    ]
  },
  {
    name: 'Cristina',
    roles: [
      'developer'
    ]
  },
  {
    name: 'Marcos',
    roles: [
      'developer'
    ]
  },
  {
    name: 'Miguel Sabatés',
    roles: [
      'project manager'
    ]
  },
  {
    name: 'Valerie',
    roles: [
      'project manager'
    ]
  },
  {
    name: 'Miguel Fernández',
    roles: [
      'project manager',
      'admin'
    ]
  },
];
export const tasks = {
  'GET /tickets': tickets,
  'GET /tasks': _tasks,
  'GET /usuarios': usuarios.map((e, i) => {
    e['id'] = i;
    return e;
  }),
  'POST /ticket': (req: MockRequest) => {
    const newTicket: Ticket = req.body;
    newTicket.id = tickets.length;
    tickets.push(req.body);
    return newTicket.id;
  },
  'PUT /ticket/:id': (req: MockRequest) => tickets[tickets.findIndex(e => e.id === req.params.id)] = req.body,
  'DELETE /ticket/:id': (req: MockRequest) => {
    tickets.splice(tickets.findIndex(e => e.id === req.params.id), 0);
  }
};
