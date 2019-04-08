
/* IMPORT */

import {Store} from '../../../dist';

/* TODO */

class Todo extends Store<{ todos: string[] }> {

  state = {
    todos: [] as string[]
  };

  get = () => {

    return this.state.todos;

  }

  add = ( str ) => {

    const {todos} = this.state,
          todosNext = [...todos, str];

    return this.setState ({ todos: todosNext });

  }

  remove = ( str ) => {

    const {todos} = this.state,
          todosNext = todos.filter ( s => s !== str );

    return this.setState ({ todos: todosNext });

  }

  clear = () => {

    return this.setState ({ todos: [] });

  }

}

/* EXPORT */

export default Todo;
