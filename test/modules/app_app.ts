
/* IMPORT */

import {describe} from 'ava-spec';
import {mount} from '../utils/enzyme';
import App from '../mocks/apps/app';

/* APP */

const delay = ( nr = 0 ) => new Promise ( res => setTimeout ( res, nr ) ); //FIXME: Why is this needed?

describe ( 'App', it => {

  it.beforeEach ( t => {

    t.context.app = mount ( App ({}) );

  });

  it ( 'works', async t => {

    const getText = selector => t.context.app.find ( selector ).text (),
          getValue = () => getText ( '#value' ),
          getTodosNr = () => ( t.context.app.find ( '#list' ).html ().match ( /<li>/g ) || [] ).length, //FIXME: For some reason sometimes `li` elements aren't found by Enzyme
          click = selector => t.context.app.find ( selector ).simulate ( 'click' ),
          update = () => t.context.app.update ();

    /* COUNTER */

    t.is ( getValue (), '0' );

    click ( '#increment' );
    click ( '#increment' );

    update ();
    await delay ();

    t.is ( getValue (), '2' );

    click ( '#decrement' );

    update ();
    await delay ();

    t.is ( getValue (), '1' );

    /* TODO */

    t.is ( getTodosNr (), 0 );

    click ( '#add' );
    click ( '#add' );

    update ();
    await delay ();

    t.is ( getTodosNr (), 2 );

    click ( '#remove' );

    update ();
    await delay ();

    t.is ( getTodosNr (), 0 );

    click ( '#add' );
    click ( '#add' );
    click ( '#clear' );

    update ();
    await delay ();

    t.is ( getTodosNr (), 0 );

  });

});
