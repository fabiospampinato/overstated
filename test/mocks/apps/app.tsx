
/* IMPORT */

import * as React from 'react';
import connectify from '../../utils/connectify';
import Store from '../stores/app';

/* APP */

const store = new Store ();

class Render extends React.Component<any, any> {

  render () {

    const {value, todos} = this.props;

    return (
      <div id="app">
        <div id="counter">
          <div id="value">{value}</div>
          <div id="increment" onClick={store.counter.increment}>Increment</div>
          <div id="decrement" onClick={store.counter.decrement}>Decrement</div>
        </div>
        <div id="todo">
          <ul id="list">
            {todos.map ( ( str, i ) => <li key={i}>{str}</li> )}
          </ul>
          <div id="add" onClick={() => store.todo.add ( 'foo' )}>Add</div>
          <div id="remove" onClick={() => store.todo.remove ( 'foo' )}>Remove</div>
          <div id="clear" onClick={store.todo.clear}>Clear</div>
        </div>
      </div>
    );

  }

}

const App = connectify ({
  store,
  selector: ({ store }) => ({
    value: store.counter.get (),
    todos: store.todo.get ()
  })
}, Render );

/* EXPORT */

export default App;
