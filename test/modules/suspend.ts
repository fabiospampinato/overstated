
/* IMPORT */

import {describe} from 'ava-spec';
import connectify from '../utils/connectify';
import {mount} from '../utils/enzyme';
import Mocks from '../mocks/connect';
import App from '../mocks/stores/app';
import Counter from '../mocks/stores/counter';

/* SUSPEND */

describe ( 'suspend', it => {

  it ( 'can suspend updates', async t => {

    const getText = ( app, selector ) => app.find ( selector ).text (),
          getValue = app => getText ( app, '#value' ),
          getRandom = app => getText ( app, '#random' );

    const store = new Counter (),
          app = mount ( connectify ( { store, selector: Mocks.selector }, Mocks.render.selector )({}) );

    const random = getRandom ( app );

    t.is ( getValue ( app ), '0' );

    store.suspend ();

    await store.increment ();
    await store.increment ();
    await store.increment ();

    t.is ( getValue ( app ), '0' );
    t.is ( getRandom ( app ), random );
    t.true ( store.isSuspended () );

    store.unsuspend ();

    const random2 = getRandom ( app );

    t.is ( getValue ( app ), '3' );
    t.not ( random2, random );
    t.false ( store.isSuspended () );

  });

  it ( 'can suspend updates on parent stores', t => {

    const store = new App ();

    store.deep.counter.foo = function () {
      t.false ( store.isSuspended () );
      t.false ( store.counter.isSuspended () );
      t.false ( store.deep.isSuspended () );
      t.false ( store.deep.counter.isSuspended () );
      this.suspend ({ propagateUp: true });
      t.true ( store.isSuspended () );
      t.true ( store.counter.isSuspended () );
      t.true ( store.deep.isSuspended () );
      t.true ( store.deep.counter.isSuspended () );
      this.unsuspend ({ propagateUp: true });
    };

    store.deep.counter.foo ();

  });

  it ( 'can suspend updates on children stores', t => {

    const store = new App ();

    store.foo = function () {
      t.false ( store.counter.isSuspended () );
      t.false ( store.deep.isSuspended () );
      t.false ( store.deep.counter.isSuspended () );
      this.suspend ({ propagateDown: true });
      t.true ( store.counter.isSuspended () );
      t.true ( store.deep.isSuspended () );
      t.true ( store.deep.counter.isSuspended () );
      this.unsuspend ({ propagateDown: true });
    };

    store.foo ();

  });

});
