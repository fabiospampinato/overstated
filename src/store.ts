
/* IMPORT */

import {ExcludeProps, StoreType, Middleware, StateUpdater, AutosuspendOptions} from './types';
import autosuspend from './autosuspend';
import Hooks from './hooks';
import Subscriber from './subscriber';

/* STORE */

class StoreBase<State extends {} = {}, ParentStore extends ( StoreType | undefined ) = undefined, ChildrenStores extends { [index: string]: StoreType } = {}> extends Subscriber {

  state: State;
  ctx: ParentStore;

  autosuspendOptions?: AutosuspendOptions | false;
  middlewares: Middleware<State>[] = [];

  protected __middlewaresCounter: number = 0;
  protected __suspendCounter: number = 0;
  protected __suspendedUpdate: boolean = false;

  constructor () {

    super ();

    this.state = this.state || {} as State; //TSC

    Hooks.store.new.emit ( this );

  }

  emit ( callback?: Function ): Promise<void> {

    this.__suspendedUpdate = this.isSuspended ();

    if ( this.__suspendedUpdate || this.__middlewaresCounter ) {

      if ( callback ) callback ();

      return Promise.resolve ();

    }

    const refresh = Promise.all ( this.listeners.map ( listener => listener () ) );

    return refresh.then ( () => {

      if ( callback ) return callback ();

    });

  }

  setState ( updater: StateUpdater<State>, callback?: Function ): Promise<void> {

    const nextState = ( typeof updater === 'function' ) ? updater ( this.state ) : updater;

    if ( nextState == null ) {

      if ( callback ) callback ();

      return Promise.resolve ();

    }

    const prevState = this.state;

    this.state = Object.assign ( {}, this.state, nextState );

    if ( this.middlewares.length ) {

      this.__middlewaresCounter++;
      this.__suspendedUpdate = true;

      this.suspend ();

      const result = Promise.resolve ();

      for ( let i = 0, l = this.middlewares.length; i < l; i++ ) {

        result.then ( () => this.middlewares[i].call ( this, prevState ) );

      }

      const end = () => {

        this.__middlewaresCounter--;

        return this.unsuspend ( callback );

      };

      return result.then ( end ).catch ( end );

    } else {

      return this.emit ( callback );

    }

  }

  autosuspend ( options: AutosuspendOptions | false | undefined = this.autosuspendOptions ) {

    autosuspend ( this, options );

  }

  suspend () {

    this.__suspendCounter++;

  }

  unsuspend ( callback?: Function ): Promise<void> {

    if ( !this.isSuspended () ) {

      if ( callback ) callback ();

      return Promise.resolve ();

    }

    this.__suspendCounter--;

    if ( this.__suspendedUpdate && !this.isSuspended () ) return this.emit ( callback );

    if ( callback ) callback ();

    return Promise.resolve ();

  }

  isSuspended () {

    return !!this.__suspendCounter;

  }

  registerMiddleware ( middleware: Middleware<State> ) {

    const index = this.middlewares.indexOf ( middleware );

    if ( index >= 0 ) return;

    this.middlewares.push ( middleware );

  }

  unregisterMiddleware ( middleware: Middleware<State> ) {

    const index = this.middlewares.indexOf ( middleware );

    if ( index < 0 ) return;

    this.middlewares.splice ( index, 1 );

  }

}

type Store<State extends {} = {}, ParentStore extends ( StoreType | undefined ) = undefined, ChildrenStores extends ExcludeProps<Store> = {}> = StoreBase<State, ParentStore, ChildrenStores> & ChildrenStores;

const Store: {
  prototype: Store<any, any, {}>,
  new <State extends {} = {}, ParentStore extends ( StoreType | undefined ) = undefined, ChildrenStores extends ExcludeProps<Store> = {}> (): Store<State, ParentStore, ChildrenStores>
} = StoreBase as any;

/* EXPORT */

export default Store;

export {StoreBase, Store}; //TSC
