
/* IMPORT */

import * as React from 'react';

/* TYPES */

type ExcludeProps<T> = { [P in keyof T]?: 'Error: You cannot use this particular property name' & number } & { [prop: string]: any; };

type FunctionComponent<P = any> = React.FunctionComponent<P>;

type Component<P = any> = typeof React.Component | FunctionComponent<P>;

type StoreType<S = any, PS = any, CS = {}> = import ( './store' ).default<S, PS, CS>;
type StoreClass<S = any, PS = any, CS = {}> = Constructor<StoreType<S, PS, CS>>;
type StoreLike = StoreType | StoreClass;

type SubscriberListener<ListenerArgs extends any[] = []> = ( ...args: ListenerArgs ) => any;

type Middleware<State> = ( prevState: Readonly<State> ) => any;

type StateUpdater<State> = ( ( prevState: Readonly<State> ) => Partial<State> | null | undefined ) | Partial<State> | null | undefined;

type ConnectOptionsObj = {
  render?: Component,
  selector?: Function,
  store?: StoreLike,
  stores?: StoreLike[]
};

type ConnectOptions = StoreLike | ConnectOptionsObj;

type ConnectProps = {
  store?: StoreType,
  stores?: StoreType[],
  [index: string]: any
};

type ConnectData = [ConnectProps, StoreType[]];

type DebugOptions = {
  collapsed?: boolean,
  logNewStores?: boolean,
  logStateDiffChanges?: boolean,
  logStateFullChanges?: boolean
};

type ContextMap = Map<Function, StoreType>;
type Context = ContextMap | null;

type AutosuspendOptions = {
  children?: boolean,
  methods?: RegExp,
  methodsInclude?: RegExp,
  methodsExclude?: RegExp,
  propagateUp?: boolean,
  propagateDown?: boolean
};

type SuspensionOptions = {
  propagateUp?: boolean,
  propagateDown?: boolean
};

/* INTERFACES */

interface Constructor<Type> {
  new ( ...args: any[] ): Type
}

/* EXPORT */

export {Constructor, ExcludeProps, FunctionComponent, Component, StoreType, StoreClass, StoreLike, SubscriberListener, Middleware, StateUpdater, ConnectOptionsObj, ConnectOptions, ConnectProps, ConnectData, DebugOptions, ContextMap, Context, AutosuspendOptions, SuspensionOptions};
