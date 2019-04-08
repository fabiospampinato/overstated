
/* IMPORT */

import {describe} from 'ava-spec';
import Todo from '../mocks/stores/todo';

/* TODO */

describe ( 'Todo', it => {

  it.beforeEach ( t => {

    t.context.todo = new Todo ();

  });

  it ( 'supports setting a default state', t => {

    t.deepEqual ( t.context.todo.state, { todos: [] } );

  });

  it ( 'can add todos', async t => {

    await t.context.todo.add ( 'foo' );
    await t.context.todo.add ( 'bar' );

    t.deepEqual ( t.context.todo.get (), ['foo', 'bar'] );

  });

  it ( 'can remove todos', async t => {

    await t.context.todo.add ( 'foo' );
    await t.context.todo.add ( 'bar' );
    await t.context.todo.add ( 'foo' );
    await t.context.todo.remove ( 'foo' );

    t.deepEqual ( t.context.todo.get (), ['bar'] );

  });

  it ( 'can remove all todos', async t => {

    await t.context.todo.add ( 'foo' );
    await t.context.todo.add ( 'bar' );
    await t.context.todo.clear ();

    t.is ( t.context.todo.get ().length, 0 );

  });

});
