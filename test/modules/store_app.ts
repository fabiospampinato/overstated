
/* IMPORT */

import {describe} from 'ava-spec';
import spy from 'call-spy';
import App from '../mocks/stores/app';
import Counter from '../mocks/stores/counter';
import Todo from '../mocks/stores/todo';

/* APP */

describe ( 'App', it => {

  it.beforeEach ( t => {

    t.context.app = new App ();

  });

  describe ( 'parent store', it => {

    it ( 'has a link to the child stores', t => {

      t.true ( t.context.app.counter instanceof Counter );
      t.true ( t.context.app.counter2 instanceof Counter );
      t.true ( t.context.app.counter !== t.context.app.counter2 );
      t.true ( t.context.app.todo instanceof Todo );
      t.true ( t.context.app.todo2 instanceof Todo );
      t.true ( t.context.app.todo !== t.context.app.todo2 );

    });

    it ( 'has no ctx property', t => {

      t.is ( t.context.app.ctx, undefined );

    });

    it ( 'can call functions from the child stores', async t => {

      t.is ( t.context.app.counter.get (), 0 );

      await t.context.app.counter.increment ();

      t.is ( t.context.app.counter.get (), 1 );

    });

    it ( 'calls subscribers on child stores update', async t => {

      const [subscriber, res] = spy ( () => {} );

      t.context.app.subscribe ( subscriber );

      await t.context.app.counter.increment ();

      t.is ( res.calls, 1 );

    });

  });

  describe ( 'child store', it => {

    it ( 'has a link to the parent store', t => {

      t.is ( t.context.app.counter.ctx, t.context.app );

    });

    it ( 'can call functions from the parent store', t => {

      t.is ( t.context.app.counter.ctx.isLoaded (), false );

    });

  });

});
