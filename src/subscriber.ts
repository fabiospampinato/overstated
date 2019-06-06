
/* IMPORT */

import {SubscriberListener} from './types';

/* SUBSCRIBER */

class Subscriber<ListenerArgs extends any[] = []> {

  listeners: SubscriberListener<ListenerArgs>[] = [];

  subscribe ( listener: SubscriberListener<ListenerArgs> ) {

    const index = this.listeners.indexOf ( listener );

    if ( index >= 0 ) return;

    this.listeners.push ( listener );

  }

  unsubscribe ( listener: SubscriberListener<ListenerArgs> ) {

    const index = this.listeners.indexOf ( listener );

    if ( index < 0 ) return;

    this.listeners = this.listeners.filter ( l => l !== listener );

  }

  emit ( ...args: ListenerArgs ): void {

    const emitArgs = arguments;

    this.listeners.forEach ( listener => {

      listener.apply ( undefined, emitArgs );

    });

  }

}

/* EXPORT */

export default Subscriber;
