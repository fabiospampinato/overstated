
/* IMPORT */

import {describe} from 'ava-spec';
import Counter from '../mocks/stores/counter';

/* COUNTER */

describe ( 'Counter', it => {

  it.beforeEach ( t => {

    t.context.counter = new Counter ();

  });

  it ( 'supports setting a default state', t => {

    t.deepEqual ( t.context.counter.state, { value: 0 } );

  });

  it ( 'can increment', async t => {

    await t.context.counter.increment ();

    t.is ( t.context.counter.get (), 1 );

  });

  it ( 'can decrement', async t => {

    await t.context.counter.decrement ();

    t.is ( t.context.counter.get (), -1 );

  });

});
