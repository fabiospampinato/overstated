
/* IMPORT */

import {describe} from 'ava-spec';
import {mount} from '../utils/enzyme';
import Todo from '../mocks/apps/todo';

/* TODO */

describe ( 'Todo', it => {

  it.beforeEach ( t => {

    t.context.app = mount ( Todo ({}) );

  });

  it ( 'works', t => {

    const getTodosNr = () => ( t.context.app.find ( '#list' ).html ().match ( /<li>/g ) || [] ).length, //FIXME: For some reason sometimes `li` elements aren't found by Enzyme
          click = selector => t.context.app.find ( selector ).simulate ( 'click' ),
          update = () => t.context.app.update ();

    t.is ( getTodosNr (), 0 );

    click ( '#add' );
    click ( '#add' );

    update ();

    t.is ( getTodosNr (), 2 );

    click ( '#remove' );

    update ();

    t.is ( getTodosNr (), 0 );

    click ( '#add' );
    click ( '#add' );
    click ( '#clear' );

    update ();

    t.is ( getTodosNr (), 0 );

  });

});
