
/* IMPORT */

import Store from './store';
import {DUMMY_OBJ} from './utils';

/* COMPOSE */

function compose<ParentStore extends StoreClass<any, any, any>> ( stores: { [index: string]: StoreLike } ) {

  return function ( ParentStore: ParentStore ) {

    class ComposedStore extends ParentStore {

      constructor ( ...args ) {

        super ( ...args );

        for ( let name in stores ) {

          const store = stores[name],
                instance = store instanceof Store ? store : new store ();

          instance.ctx = this;
          this[name] = instance;

          const self = this,
                _setState = instance.setState;

          instance.setState = function setState () {

            return _setState.apply ( instance, arguments ).then ( () => self.setState ( DUMMY_OBJ ) );

          };

        }

      }

    };

    try {

      Object.defineProperty ( ComposedStore, 'name', { value: ParentStore.name } );

    } catch {}

    return ComposedStore as ParentStore; //TSC

  };

}

/* EXPORT */

export default compose;
