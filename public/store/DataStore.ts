import { BrowserServices } from '../models/interfaces';
import _ from 'lodash';

interface IActor {
  [key: string]: Function;
}

interface ICache {
  [key: string]: any;
}

interface IStore {
  pending: boolean;

  cache: ICache;

  actor: IActor;
}

interface IStores {
  [key: string]: IStore;
}

export class DataStore {
  private stores: IStores = {};

  static errors: {
    alreadyCreated: 'DataStore is already created.';
    cantBeCreated: 'DataStore requires `services` to be created.';
    isNotCreated: 'DataStore is not created. Call DataStore.createStore(services); on the plugin initialization.';
  };
  private static instance: DataStore | undefined = undefined;

  constructor(private readonly services: BrowserServices) {
    if (!this.services && !DataStore.instance) throw new Error(DataStore.errors.cantBeCreated);
  }

  public static getInstance = () => {
    if (!DataStore.instance) throw new Error(DataStore.errors.isNotCreated);

    return DataStore.instance;
  };

  registerModelActor = (storeName: string, actorInstance: any) => {
    let store =
      this.stores[storeName] ||
      ({
        pending: true,
        cache: {},
        actor: {
          setPending: (...args: any) => this.setPending(storeName, ...args),
        },
      } as IStore);

    for (let name of Object.getOwnPropertyNames(actorInstance.__proto__)) {
      let method = actorInstance[name];

      // skip constructor and private methods (start with _ )
      if (method instanceof Function && name !== 'constructor' && name[0] !== '_') {
        store.actor[name] = async (...args: any) => {
          if (store.pending || !store.cache[name]) {
            store.cache[name] = await actorInstance[name](...args);
            store.pending = false;
          }

          return store.cache[name];
        };
      }
    }

    if (!this.stores[storeName])
      // if there is no cache yet, create store object
      this.stores[storeName] = store;
  };

  public static createStore = (services: BrowserServices) => {
    if (DataStore.instance) throw new Error(DataStore.errors.alreadyCreated);

    if (!DataStore.instance)
      // creates a new store
      DataStore.instance = new DataStore(services);
  };

  public static getStore = (store: string): IActor => {
    if (!DataStore.instance) throw new Error(DataStore.errors.isNotCreated);

    return DataStore.instance.stores[store].actor;
  };

  public static getStores = (): {
    [key: string]: IActor;
  } => {
    if (!DataStore.instance) throw new Error(DataStore.errors.isNotCreated);

    return _.mapValues(DataStore.instance.stores, (store) => store.actor);
  };

  public setPending = (store: string, pending = true) => {
    if (this.stores[store]) this.stores[store].pending = pending;
  };
}
