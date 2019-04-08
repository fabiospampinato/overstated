
/* IMPORT */

import Store from './store';

/* AUTOSUSPEND */

enum Methods {
  'suspend',
  'unsuspend'
};

const cache = new Map<StoreType, boolean> ();

const defaultOptions: AutosuspendOptions = {
  bubbles: Infinity, // How many levels to bubble up the suspension
  methods: /^(?!_|middleware|(?:(?:get|has|is)(?![a-z0-9])))/i // Methods matching this regex will be autosuspended
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

      if ( cache.get ( store ) ) return;

      return autosuspend ( method, options );

    }

    if ( typeof method !== 'function' || proto[key] || !options.methods!.test ( key ) ) return; // Not an auto-suspendable method //TSC

    function getTargets ( method: string ): StoreType[] {

      if ( targetsCache[method] ) return targetsCache[method];

      const targets = [store];

      let target = store,
          bubbles = options.bubbles;

      while ( bubbles && target.ctx && target.ctx[method] ) {
        target = target.ctx;
        bubbles -= 1;
        targets.push ( target );
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

    function handleResult ( result ) {

      trigger ( Methods.unsuspend );

      return result;

    }

    function handleError ( err: Error ) {

      trigger ( Methods.unsuspend );

      throw err;

    }

    function autosuspendWrapper () {

      try {

        trigger ( Methods.suspend );

        const result = method.apply ( this, arguments );

        if ( result instanceof Promise ) {

          return result.then ( handleResult ).catch ( handleError );

        } else {

          return handleResult ( result );

        }

      } catch ( err ) {

        return handleError ( err );

      }

    }

    try {

      Object.defineProperty ( autosuspendWrapper, 'name', { value: `${key}_autosuspended` } );

    } catch {}

    store[key] = autosuspendWrapper;

  });

};

/* EXPORT */

export default Object.assign ( autosuspend, { defaultOptions } );
