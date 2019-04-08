
/* IMPORT */

import {describe} from 'ava-spec';
import connectify from '../utils/connectify';
import {mount} from '../utils/enzyme';
import Mocks from '../mocks/connect';
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

});
