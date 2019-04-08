
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

    this.listeners.splice ( index, 1 );

  }

  emit ( ...args: ListenerArgs ): void {

    for ( let i = 0, l = this.listeners.length; i < l; i++ ) {

      this.listeners[i].apply ( undefined, arguments );

    }

  }

}

/* EXPORT */

export default Subscriber;
