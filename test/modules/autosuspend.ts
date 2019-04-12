
/* IMPORT */

import {describe} from 'ava-spec';
import spy from 'call-spy';
import App from '../mocks/stores/app';
import Counter from '../mocks/stores/counter';

/* AUTOSUSPEND */

describe ( 'autosuspend', it => {

  it ( 'can suspend updates', async t => {

    const isAutosuspended = fn => !!fn.name && fn.name.endsWith ( '_autosuspended' );

    const [handler, res] = spy ( () => {} );

    const store = new Counter ();

    store['multiincrements'] = async function () {
      await this.increment ();
      await this.increment ();
      await this.increment ();
    };

    store.subscribe ( handler );

    store.autosuspend ();

    t.true ( isAutosuspended ( store.increment ) );
    t.true ( isAutosuspended ( store.decrement ) );
    t.true ( isAutosuspended ( store['multiincrements'] ) );
    t.false ( isAutosuspended ( store.isSuspended ) );

    await store['multiincrements'] ();

    t.is ( res.calls, 1 );
    t.is ( store.get (), 3 );

  });

  it ( 'can suspend updates on parent stores', async t => {

    const [handler, res] = spy ( () => {} ),
          [handler2, res2] = spy ( () => {} );

    const store = new App ();

    store.counter.multiincrements = async function () {
      await this.increment ();
      await this.increment ();
      await this.increment ();
    };

    store.subscribe ( handler );
    store.counter.subscribe ( handler2 );

    store.counter.autosuspend ();

    await store.counter.multiincrements ();

    t.is ( res.calls, 1 );
    t.is ( res2.calls, 1 );
    t.is ( store.counter.get (), 3 );

  });

  it ( 'can autosuspend children stores', t => {

    const isAutosuspended = fn => !!fn.name && fn.name.endsWith ( '_autosuspended' );

    const store = new App ();

    store.autosuspend ();

    t.true ( isAutosuspended ( store.counter.increment ) );

  });

  it ( 'can not autosuspend children stores', t => {

    const isAutosuspended = fn => !!fn.name && fn.name.endsWith ( '_autosuspended' );

    const store = new App ();

    store.autosuspend ({ children: false });

    t.false ( isAutosuspended ( store.counter.increment ) );

  });

  it ( 'throws an error when autosuspending twice', t => {

    const store = new Counter ();

    t.throws ( () => {

      store.autosuspend ();
      store.autosuspend ();

    }, 'You can\'t autosuspend the same store multiple times' );

  });

});
