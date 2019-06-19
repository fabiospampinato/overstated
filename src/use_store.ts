
/* IMPORT */

import areShallowEqual from  'are-shallow-equal';
import {useContext, useEffect, useMemo, useRef, useState} from 'react';
import useMounted from 'react-use-mounted';
import usePrevious from 'react-use-previous';
import {Constructor, StoreType} from './types';
import Context from './context';
import {getStoreInstance} from './utils';

/* USE STORE */

function useStore<S extends StoreType, R> ( store: S | Constructor<S>, selector: ( store: S ) => R, deps: ReadonlyArray<any> = [] ): R {

  const context = useContext ( Context );

  if ( !context ) throw new Error ( 'You probably forgot to wrap your app with <Provider>' );

  const instance = getStoreInstance ( context, store ),
        mounted = useMounted (),
        selectorMemo = useMemo ( () => selector, deps ),
        selectorRef = useRef ( selectorMemo );

  let [data, setData] = useState ( () => selectorRef.current ( instance ) ),
      prevData = usePrevious ( data );

  if ( selectorRef.current !== selectorMemo ) {

    selectorRef.current = selectorMemo;

    data = selectorMemo ( instance );

    setData ( data );

  }

  useEffect ( () => {

    function update () {

      if ( !mounted.current ) return;

      const nextData = selectorRef.current ( instance ),
            shouldUpdate = !areShallowEqual ( prevData.current, nextData );

      if ( !shouldUpdate ) return;

      setData ( nextData );

    }

    instance.subscribe ( update );

    return () => instance.unsubscribe ( update );

  }, [mounted, instance, prevData] );

  return data;

}

/* EXPORT */

export default useStore;
