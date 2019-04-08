
/* IMPORT */

import {describe} from 'ava-spec';
import spy from 'call-spy';
import {Store} from '../../dist';

/* STORE */

describe ( 'Store', it => {

  it.beforeEach ( t => {

    t.context.store = new Store ();

  });

  it ( 'defaults to an empty state', t => {

    t.deepEqual ( t.context.store.state, {} );

  });

  describe ( 'setState', it => {

    it ( 'supports a plain object', async t => {

      const state = { foo: 2, bar: [true] },
            state2 = { baz: 3 };

      await t.context.store.setState ( state );

      t.deepEqual ( t.context.store.state, state );

      await t.context.store.setState ( state2 );

      t.deepEqual ( t.context.store.state, Object.assign ( state, state2 ) );

    });

    it ( 'supports a function', async t => {

      const state = { foo: true },
            updater = () => state,
            updater2 = prevState => ({ foo: !prevState.foo });

      await t.context.store.setState ( updater );

      t.deepEqual ( t.context.store.state, state );

      await t.context.store.setState ( updater2 );

      t.deepEqual ( t.context.store.state, { foo: false } );

    });

    it ( 'supports a callback', async t => {

      const [fn, res] = spy ( () => {} );

      t.is ( res.calls, 0 );

      await t.context.store.setState ( {}, fn );
      await t.context.store.setState ( null, fn );

      t.is ( res.calls, 2 );

    });

    it ( 'it doesn\'t mutate the state', async t => {

      const state = t.context.store.state;

      await t.context.store.setState ({ foo: true });

      t.not ( t.context.store.state, state );

    });

    it ( 'calls subscribers on update', async t => {

      const [subscriber, res] = spy ( () => {} ),
            [subscriber2, res2] = spy ( () => {} );

      t.context.store.subscribe ( subscriber );
      t.context.store.subscribe ( subscriber2 );

      await t.context.store.setState ({ foo: true });

      t.is ( res.calls, 1 );
      t.is ( res2.calls, 1 );

    });

    it ( 'if null/undefined is set, it doesn\'t change the state ', async t => {

      const state = t.context.store.state;

      await t.context.store.setState ( null );
      await t.context.store.setState ( undefined );
      await t.context.store.setState ( () => null );
      await t.context.store.setState ( () => undefined );

      t.is ( t.context.store.state, state );

    });

    it ( 'if null/undefined is set, it doesn\'t call subscribers', async t => {

      const [subscriber, res] = spy ( () => {} );

      t.context.store.subscribe ( subscriber );

      await t.context.store.setState ( null );
      await t.context.store.setState ( undefined );
      await t.context.store.setState ( () => null );
      await t.context.store.setState ( () => undefined );

      t.is ( res.calls, 0 );

    });

  });

});
