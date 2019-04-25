
/* IMPORT */

import {useContext, useEffect, useState} from 'react';
import Context from './context';
import usePrevious from './use_previous';
import {getStoreInstance, isShallowEqual} from './utils';

/* USE STORE */

function useStore<S extends StoreType, R> ( store: S | Constructor<S>, selector: ( store: S ) => R, initialState = {}): R {

  const context = useContext ( Context );

  if ( !context ) throw new Error ( 'You probably forgot to wrap your app with <Provider>' );

  const instance = getStoreInstance ( context, store ),
        [data, setData] = useState(() => {
          const state = selector(instance)

          return {
            ...state,
            ...initialState
          }
        }),
        prevData = usePrevious ( data );

  useEffect ( () => {

    function update () {

      const nextData = selector ( instance ),
            shouldUpdate = !isShallowEqual ( prevData, nextData );

      if ( !shouldUpdate ) return;

      setData ( nextData );

    }

    instance.subscribe ( update );

    return () => instance.unsubscribe ( update );

  }, [instance, selector] );

  return data;

}

/* EXPORT */

export default useStore;
