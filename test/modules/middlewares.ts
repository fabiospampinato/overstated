
/* IMPORT */

import {describe} from 'ava-spec';
import spy from 'call-spy';
import connectify from '../utils/connectify';
import {mount} from '../utils/enzyme';
import Counter from '../mocks/stores/counter';
import Mocks from '../mocks/middlewares';

/* MIDDLEWARES */

describe ( 'middlewares', it => {

  it ( 'can register a middleware', t => {

    const store = new Counter ();

    store.registerMiddleware ( Mocks.middlewares.doubler );
    store.registerMiddleware ( Mocks.middlewares.noop );

    t.true ( store.middlewares.includes ( Mocks.middlewares.doubler ) );
    t.true ( store.middlewares.includes ( Mocks.middlewares.noop ) );

  });

  it ( 'doesn\'t register the same middleware twice', t => {

    const store = new Counter ();

    store.registerMiddleware ( Mocks.middlewares.doubler );
    store.registerMiddleware ( Mocks.middlewares.doubler );

    t.is ( store.middlewares.length, 1 );

  });

  it ( 'can unregister a middleware', t => {

    const store = new Counter ();

    store.registerMiddleware ( Mocks.middlewares.doubler );
    store.unregisterMiddleware ( Mocks.middlewares.doubler );

    t.false ( store.middlewares.includes ( Mocks.middlewares.doubler ) );

  });

  it ( 'calls all middlewares when the state changes', async t => {

    const store = new Counter (),
          [middleware, res] = spy ( Mocks.middlewares.noop ),
          [middleware2, res2] = spy ( Mocks.middlewares.noop );

    store.registerMiddleware ( middleware );
    store.registerMiddleware ( middleware2 );

    await store.setState ({ value: 1 });

    t.is ( res.calls, 1 );
    t.deepEqual ( res.arguments, [{ value: 0 }] );

    t.is ( res2.calls, 1 );
    t.deepEqual ( res2.arguments, [{ value: 0 }] );

  });

  it ( 'calls all middlewares when the state changes from within a middleware', async t => {

    const store = new Counter (),
          [middleware, res] = spy ( Mocks.middlewares.doubler ),
          [middleware2, res2] = spy ( Mocks.middlewares.noop );

    store.registerMiddleware ( middleware );
    store.registerMiddleware ( middleware2 );

    await store.setState ({ value: 1 });

    t.is ( res.calls, 2 );
    t.deepEqual ( res.arguments, [{ value: 1 }] );

    t.is ( res2.calls, 2 );
    t.deepEqual ( res2.arguments, [{ value: 1 }] );

  });

  it ( 'suspends rendering while middlewares are run', async t => {

    const store = new Counter (),
          [render, res] = spy ( Mocks.render ),
          app = mount ( connectify ( { store }, render )({}) );

    t.is ( res.calls, 1 );

    store.registerMiddleware ( Mocks.middlewares.doubler );
    store.registerMiddleware ( Mocks.middlewares.noop );

    await store.setState ({ value: 1 });

    t.false ( store.isSuspended () );
    t.is ( app.find ( 'div' ).text (), '2' );
    t.is ( res.calls, 2 );

  });

});
