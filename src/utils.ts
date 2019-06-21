
/* IMPORT */

import areShallowEqual from 'are-shallow-equal';
import {Constructor, StoreType, ContextMap, SuspensionOptions} from './types';
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

function getStoreSuspensionTargets ( store: StoreType, options: SuspensionOptions ): StoreType[] {

  const id = getStoreSuspensionTargetsId ( options ),
        cache = store['__suspensionTargets'] || ( store['__suspensionTargets'] = {} );

  if ( cache[id] ) return cache[id];

  return cache[id] = getStoreSuspensionTargetsFresh ( store, options );

}

function getStoreSuspensionTargetsId ( options: SuspensionOptions ): number {

  const {propagateUp, propagateDown} = options;

  return ( propagateUp ? 0b01 : 0 ) + ( propagateDown ? 0b10 : 0 );

}

function getStoreSuspensionTargetsFresh ( store: StoreType, options: SuspensionOptions ): StoreType[] {

  let targets: StoreType[] = [];

  if ( options.propagateUp ) {

    const parent = getStoreTopmostParent ( store );

    if ( parent ) {

      targets.push ( parent );

      targets = targets.concat ( getStoreChildren ( parent, store ) );

    }

  }

  if ( options.propagateDown ) {

    targets = targets.concat ( getStoreChildren ( store ) );

  }

  return targets;

}

function getStoreTopmostParent ( store: StoreType ): StoreType | undefined {

  if ( !store.ctx ) return;

  let parent = store.ctx;

  while ( parent.ctx ) parent = parent.ctx;

  return parent;

}

function getStoreChildren ( store: StoreType, exclude?: StoreType ): StoreType[] {

  let children: StoreType[] = [];

  Object.keys ( store ).forEach ( key => {

    const child = store[key];

    if ( !( child instanceof Store ) ) return;

    if ( child.ctx !== store ) return; // Ensuring it's a proper child originated from compose

    if ( child === exclude ) return;

    children.push ( child );

    children = children.concat ( getStoreChildren ( child, exclude ) );

  });

  return children;

}

function isEmptyObject ( x ) {

  return areShallowEqual ( x, DUMMY_OBJ );

}

function isNativeClass ( x ) {

  return typeof x === 'function' && /^class\s/.test ( Function.prototype.toString.call ( x ) );

}

function padLeft ( str: string | number, length: number, padding: string | number ) {

  for ( let i = 0, l = length - String ( str ).length; i < l; i++ ) {
    str = `${padding}${str}`;
  }

  return str;

}

/* EXPORT */

export {DUMMY_OBJ, DUMMY_ARR, getStoreInstance, getStoreSuspensionTargets, isEmptyObject, isNativeClass, padLeft};
