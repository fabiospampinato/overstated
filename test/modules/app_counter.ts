
/* IMPORT */

import {describe} from 'ava-spec';
import {mount} from '../utils/enzyme';
import Counter from '../mocks/apps/counter';

/* COUNTER */

describe ( 'Counter', it => {

  it.beforeEach ( t => {

    t.context.app = mount ( Counter ({}) );

  });

  it ( 'works', t => {

    const getText = selector => t.context.app.find ( selector ).text (),
          getValue = () => getText ( '#value' ),
          click = selector => t.context.app.find ( selector ).simulate ( 'click' ),
          update = () => t.context.app.update ();

    t.is ( getValue (), '0' );

    click ( '#increment' );
    click ( '#increment' );

    update ();

    t.is ( getValue (), '2' );

    click ( '#decrement' );

    update ();

    t.is ( getValue (), '1' );

  });

});
