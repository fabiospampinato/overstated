
/* IMPORT */

import {Store} from '../../../dist';

/* COUNTER */

class Counter extends Store<{ value: number }> {

  state = {
    value: 0
  };

  get = () => {

    return this.state.value;

  }

  increment = () => {

    const {value} = this.state;

    return this.setState ({ value: value + 1 });

  }

  decrement = () => {

    const {value} = this.state;

    return this.setState ({ value: value - 1 });

  }

}

/* EXPORT */

export default Counter;
