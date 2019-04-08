
/* IMPORT */

import * as React from 'react';
import connectify from '../../utils/connectify';
import Store from '../stores/todo';

/* TODO */

const store = new Store ();

const Todo = connectify ({
  store,
  selector: ({ store }) => ({
    todos: store.get (),
    add: store.add,
    remove: store.remove,
    clear: store.clear
  }),
  render: ({ todos, add, remove, clear }) => (
    <div id="todo">
      <ul id="list">
        {todos.map ( ( str, i ) => <li key={i}>{str}</li> )}
      </ul>
      <div id="add" onClick={() => add ( 'foo' )}>Add</div>
      <div id="remove" onClick={() => remove ( 'foo' )}>Remove</div>
      <div id="clear" onClick={clear}>Clear</div>
    </div>
  )
});

/* EXPORT */

export default Todo;
