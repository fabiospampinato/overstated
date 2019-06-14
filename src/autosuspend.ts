
/* IMPORT */

import callHooks from 'call-hooks';
import {StoreType, AutosuspendOptions} from './types';
import Store from './store';

/* AUTOSUSPEND */

enum Methods {
  'suspend',
  'unsuspend'
};

const cache = new Map<StoreType, boolean> ();

const defaultOptions: AutosuspendOptions = {
  methods: /^(?!_|(?:(?:get|has|is)(?![a-z0-9])))/, // Methods matching this regex will be autosuspended
  methodsInclude: undefined, // Methods matching this regex will be autosuspended, has higher priority over the "methods" regex
  methodsExclude: undefined, // Methods matching this regex will be autosuspended, has higher priority over the "methods" regex and the "methodsInclude" regex
  bubble: true, // Whether to bubble up the suspension to parents
  children: true // Whether to autosuspend children too
};

function autosuspend ( store: StoreType, storeOptions: AutosuspendOptions | false | undefined = store.autosuspendOptions ) {

  if ( cache.get ( store ) ) throw new Error ( 'You can\'t autosuspend the same store multiple times' );

  if ( storeOptions === false ) return; // Disabled for this store

  cache.set ( store, true );

  const options: AutosuspendOptions = storeOptions ? Object.assign ( {}, defaultOptions, storeOptions ) : defaultOptions,
        proto = Store.prototype,
        targetsCache: { [index: string]: StoreType[] } = {};

  Object.keys ( store ).forEach ( key => {

    const method = store[key];

    if ( method instanceof Store ) {

      if ( !options.children || cache.get ( method ) ) return;

      return autosuspend ( method, options );

    }

    if ( typeof method !== 'function' || proto[key] || ( options.methodsExclude && options.methodsExclude.test ( key ) ) || ( ( !options.methodsInclude || !options.methodsInclude.test ( key ) ) && ( !options.methods || !options.methods.test ( key ) ) ) ) return; // Not an auto-suspendable method

    function getTargets ( method: string ): StoreType[] {

      if ( targetsCache[method] ) return targetsCache[method];

      const targets = [store];

      let target = store;

      if ( options.bubble ) {
        while ( target.ctx && target.ctx[method] ) {
          target = target.ctx;
          targets.push ( target );
        }
      }

      return targets;

    }

    function trigger ( id: Methods ) {

      const method = Methods[id],
            targets = getTargets ( method );

      for ( let i = 0, l = targets.length; i < l; i++ ) {

        targets[i][method]();

      }

    }

    const autosuspendWrapper = callHooks ( method, {
      before: () => trigger ( Methods.suspend ),
      after: () => trigger ( Methods.unsuspend )
    });

    try {

      Object.defineProperty ( autosuspendWrapper, 'name', { value: `${key}_autosuspended` } );

    } catch {}

    store[key] = autosuspendWrapper;

  });

};

/* EXPORT */

export default Object.assign ( autosuspend, { defaultOptions } );
