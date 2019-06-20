
/* IMPORT */

import {Store, compose} from '../../../dist';
import Counter from './counter';
import Todo from './todo';

/* APP */

class App extends Store<{ loaded: boolean }, undefined, { counter: import ( './counter' ).default, todo: import ( './todo' ).default }> {

  state = {
    loaded: false
  };

  isLoaded = () => {

    return this.state.loaded;

  }

}

/* EXPORT */

export default compose ({
  counter: Counter,
  counter2: new Counter (),
  todo: Todo,
  todo2: new Todo (),
  deep: compose ({
    counter: new Counter (),
    todo: new Todo ()
  })( Counter )
})( App );
