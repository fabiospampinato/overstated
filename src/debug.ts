
/* IMPORT */

import {detailedDiff} from 'deep-object-diff';
import Hooks from './hooks';
import {isEmptyObject, isShallowEqual, padLeft} from './utils';

/* DEBUG */

const defaultOptions: DebugOptions = {
  collapsed: false,
  logNewStores: false,
  logStateDiffChanges: true,
  logStateFullChanges: true
};

function debug ( options: DebugOptions = {} ) {

  options = Object.assign ( {}, defaultOptions, options );

  const OVERSTATED = {
    stores: {},
    get states () {
      return Object.entries ( OVERSTATED.stores ).reduce ( ( acc, [name, store] ) => {
        acc[name] = store['state'];
        return acc;
      }, {} );
    },
    log () {
      for ( const [name, state] of Object.entries ( OVERSTATED.states ) ) {
        console.log ( `%c${name}\n `, 'font-weight:bold', state );
      }
    }
  };

  Hooks.store.new.subscribe ( store => {

    const {name} = store.constructor;

    OVERSTATED.stores[name] = store;

    if ( options.logNewStores ) {
      console.log ( 'New store\n ', store );
    }

    if ( options.logStateFullChanges || options.logStateDiffChanges ) {

      const group = options.collapsed ? console.groupCollapsed.bind ( console ) : console.group.bind ( console ),
            groupEnd = console.groupEnd.bind ( console );

      let prevState = store.state;

      setTimeout ( () => prevState = store.state ); // The initial state is set after the constructor (and the hook) is behing called

      store.subscribe ( () => {

        const date = new Date (),
              timestamp = `[${padLeft ( date.getHours (), 2, 0 )}:${padLeft ( date.getMinutes (), 2, 0 )}:${padLeft ( date.getSeconds (), 2, 0 )}.${padLeft ( date.getMilliseconds (), 3, 0 )}]`;

        group ( `${name} ${timestamp}` );

        const {state} = store;

        if ( options.logStateDiffChanges ) {

          const {added, updated, deleted} = detailedDiff ( prevState, state ) as any; //TSC

          if ( !isEmptyObject ( added ) ) {
            console.log ( 'Added\n ', added );
          }

          if ( !isEmptyObject ( updated ) ) {
            console.log ( 'Updated\n ', updated );
          }

          if ( !isEmptyObject ( deleted ) ) {
            console.log ( 'Deleted\n ', deleted );
          }

        }

        if ( options.logStateFullChanges && !isShallowEqual ( state, prevState ) ) {
          console.log ( 'New state\n ', state );
          console.log ( 'Old state\n ', prevState );
        }

        groupEnd ();

        prevState = state;

      });

    }

  });

  if ( typeof window !== 'undefined' ) {

    window['OVERSTATED'] = OVERSTATED;

  }

}

/* EXPORT */

export default Object.assign ( debug, { defaultOptions } );
