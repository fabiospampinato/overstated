
/* IMPORT */

import {describe} from 'ava-spec';
import spy from 'call-spy';
import App from '../mocks/stores/app';
import Counter from '../mocks/stores/counter';
import {getStoreSuspensionTargets} from '../../dist/utils';

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

  it ( 'can suspend updates on parent stores', t => {

    const store = new App ();

    store.deep.counter.foo = function () {
      t.true ( store.isSuspended () );
      t.true ( store.counter.isSuspended () );
      t.true ( store.deep.isSuspended () );
      t.true ( store.deep.counter.isSuspended () );
    };

    store.deep.counter.autosuspend ({ propagateUp: true });
    store.deep.counter.foo ();

  });

  it ( 'can suspend updates on children stores', t => {

    const store = new App ();

    store.foo = function () {
      t.true ( store.counter.isSuspended () );
      t.true ( store.deep.isSuspended () );
      t.true ( store.deep.counter.isSuspended () );
    };

    store.autosuspend ({ propagateDown: true });
    store.foo ();

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
