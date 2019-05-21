
/* IMPORT */

import * as _isShallowEqual from 'is-shallow-equal';
import {Constructor, StoreType, ContextMap} from './types';
import Store from './store';

/* UTILS */

// Using dummy objects in order to avoid allocating useless new objects

const DUMMY_OBJ = {};

const DUMMY_ARR = [];

function getStoreInstance<S extends StoreType> ( map: ContextMap, store: S | Constructor<S> ): S {

  if ( store instanceof Store ) {

    let instance = map.get ( store.constructor ) as S | undefined;

    if ( instance ) return instance;

    map.set ( store.constructor, store );

    return store;

  } else {

    let instance = map.get ( store ) as S | undefined;

    if ( instance ) return instance;

    instance = new store ();

    map.set ( store, instance );

    return instance;

  }

}

function isEmptyObject ( x ) {

  return _isShallowEqual ( x, DUMMY_OBJ );

}

function isNativeClass ( x ) {

  return typeof x === 'function' && /^class\s/.test ( Function.prototype.toString.call ( x ) );

}

function isPrimitive ( x ) {

  if ( typeof x === 'object' ) return x === null;

  return typeof x !== 'function';

}

function isShallowEqual ( a, b ) {

  return isPrimitive ( a ) || isPrimitive ( b ) ? a === b : _isShallowEqual ( a, b );

}

function padLeft ( str: string | number, length: number, padding: string | number ) {

  for ( let i = 0, l = length - String ( str ).length; i < l; i++ ) {
    str = `${padding}${str}`;
  }

  return str;

}

/* EXPORT */

export {DUMMY_OBJ, DUMMY_ARR, getStoreInstance, isEmptyObject, isNativeClass, isPrimitive, isShallowEqual, padLeft};
