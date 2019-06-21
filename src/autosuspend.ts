
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
  children: true, // Whether to autosuspend children too
  methods: /^(?!_|(?:(?:get|has|is)(?![a-z0-9])))/, // Methods matching this regex will be autosuspended
  methodsInclude: undefined, // Methods matching this regex will be autosuspended, has higher priority over the "methods" regex
  methodsExclude: undefined, // Methods matching this regex will be autosuspended, has higher priority over the "methods" regex and the "methodsInclude" regex
  propagateUp: false, // Whether to propagate up the suspension to parents
  propagateDown: false // Whether to propagate down the suspension to children
};

function autosuspend ( store: StoreType<any, any, any>, storeOptions: AutosuspendOptions | false | undefined = store.autosuspendOptions ) {

  if ( cache.get ( store ) ) throw new Error ( 'You can\'t autosuspend the same store multiple times' );

  if ( storeOptions === false ) return; // Disabled for this store

  cache.set ( store, true );

  const options: AutosuspendOptions = storeOptions ? Object.assign ( {}, defaultOptions, storeOptions ) : defaultOptions,
        {propagateUp, propagateDown} = options,
        methodOptions = {propagateUp, propagateDown},
        proto = Store.prototype;

  Object.keys ( store ).forEach ( key => {

    const method = store[key];

    if ( method instanceof Store ) {

      if ( method.ctx !== store ) return; // Ensuring it's a proper child originated from compose

      if ( !options.children || cache.get ( method ) ) return;

      return autosuspend ( method, options );

    }

    if ( typeof method !== 'function' || proto[key] || ( options.methodsExclude && options.methodsExclude.test ( key ) ) || ( ( !options.methodsInclude || !options.methodsInclude.test ( key ) ) && ( !options.methods || !options.methods.test ( key ) ) ) ) return; // Not an auto-suspendable method

    function trigger ( id: Methods ) {

      const method = Methods[id];

      store[method]( methodOptions );

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
