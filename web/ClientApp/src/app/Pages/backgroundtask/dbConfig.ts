import { DBConfig, NgxIndexedDBModule } from 'ngx-indexed-db';



export const dbConfig: DBConfig = {
  name: 'ProcessesDb',
  version: 1,
  objectStoresMeta: [
    {
      store: "bgProcesses",
      storeConfig: { keyPath: 'id', autoIncrement: true },
      storeSchema: [
        { name: 'state', keypath: 'state', options: { unique: false } },
        { name: 'time', keypath: 'time', options: { unique: false } }
      ]
    }
  ]
};
