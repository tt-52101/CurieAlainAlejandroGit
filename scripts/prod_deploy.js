/**
 * Este script se encarga de actualizar el fichero de propiedades de angular para 
 * cada despliegue.
 * @author Ayoze Martín Hernández
 * @version 1.0
 */
"use strict";
const fs = require('fs');
const path = require('path');

// Consulta las variables de entorno necesarias
const { manager_domain, manager_api_user, manager_api_password, manager_api_key } = process.env
const paths = {
  base: path.join(__dirname.replace(`${path.sep}scripts`, ''), `src${path.sep}environments${path.sep}`),
  from: 'environment.ts',
  to: 'environment.prod.ts'
}
const filters = [
  { toReplace: 'export const environment =' },
  { toReplace: ';' },
  { toReplace: '`', with: '\"' },
  { toReplace: '\'', with: '\"' }
];


try {
  // Lee el fichero de environmonents de angular
  let content = fs.readFileSync(path.join(paths.base, paths.from)).toString();

  // Lo convierte en objeto para poder tratarlo
  content = JSON.parse(filters.reduce((prev, actual) => {
    return prev.replace(new RegExp(actual.toReplace, 'g'), actual.with || '');
  }, content));

  // prepara para produccion
  content.production = true;
  // Modifica lo valores variables por maquina
  content.domain = manager_domain;
  content.baseurl = manager_domain.concat('/crm/webservice');
  content.auth.user = manager_api_user;
  content.auth.passwd = manager_api_password;
  content.apiKey = manager_api_key;

  // Escribe el fichero para que siga compilando angular
  fs.writeFileSync(path.join(paths.base, paths.to), `export const environment = ${JSON.stringify(content)}`);
  console.log('\x1b[32m%s\x1b[0m', 'Variables de entorno actualizadas');
} catch (error) {
  console.log('\x1b[31m%s\x1b[0m', 'No se pudieron actualizar las variables de entorno');
  console.error(error);
}