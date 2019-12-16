// This file can be replaced during build by using the `fileReplacements` array.
// `ng build ---prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  SERVER_URL: `./`,
  production: false,
  useHash: false,
  hmr: true,
  baseurl: 'https://demo.curieplatform.com/crm/webservice',
  auth: {
    user: 'Itopdemo',
    passwd: 'Passw0rd'
  },
  apiKey: 'eC45KxcBcv7dbdK7hncNz48wrK0eQTaXV0nTYmnthzjKbx36QnKH8d6q13dqC3fM'
};

/*
 * In development mode, to ignore zone related error stack frames such as
 * `zone.run`, `zoneDelegate.invokeTask` for easier debugging, you can
 * import the following file, but please comment it out in production mode
 * because it will have performance impact when throw error
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.
