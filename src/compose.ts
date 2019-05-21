
/* IMPORT */

import {StoreClass, StoreLike, StoreType} from './types';
import Store from './store';
import {DUMMY_OBJ, isNativeClass} from './utils';

/* HELPERS */

function extendEval<ParentStore extends StoreClass<any, any, any>> ( ParentStore: ParentStore, stores: { [index: string]: StoreLike } ) { //URL: https://github.com/microsoft/TypeScript/issues/17088

  let result;

  return eval (`
    result = class ComposedStore extends ParentStore {
      constructor ( ...args ) {
        super ( ...args );
        linkStores ( this, stores );
      }
    };
  `);

  return result;

}

function extendJS<ParentStore extends StoreClass<any, any, any>> ( ParentStore: ParentStore, stores: { [index: string]: StoreLike } ) {

  return class ComposedStore extends ParentStore {
    constructor ( ...args ) {
      super ( ...args );
      linkStores ( this, stores );
    }
  };

}

function linkStores<ParentStore extends StoreType<any, any, any>> ( parent: ParentStore, children: { [index: string]: StoreLike } ) {

  for ( let name in children ) {

    const store = children[name],
          instance = store instanceof Store ? store : new store (); //FIXME: Use `getStoreInstance` instead, how can we do it while supporting nested `<Provider>`?

    instance.ctx = parent;
    parent[name] = instance;

    const _setState = instance.setState;

    instance.setState = function setState () {

      return _setState.apply ( instance, arguments ).then ( () => parent.setState ( DUMMY_OBJ ) );

    };

  }

}

/* COMPOSE */

function compose<ParentStore extends StoreClass<any, any, any>> ( stores: { [index: string]: StoreLike } ) {

  return function ( ParentStore: ParentStore ) {

    const ComposedStore = isNativeClass ( ParentStore ) ? extendEval ( ParentStore, stores ) : extendJS ( ParentStore, stores );

    try {

      Object.defineProperty ( ComposedStore, 'name', { value: ParentStore.name } );

    } catch {}

    return ComposedStore as ParentStore; //TSC

  };

}

/* EXPORT */

export default compose;
