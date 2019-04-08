
/* IMPORT */

import * as React from 'react';
import connectify from '../../utils/connectify';
import Store from '../stores/counter';

/* COUNTER */

const Counter = connectify ({
  store: Store,
  selector: ({ store }) => ({
    store,
    value: store.get (),
    increment: store.increment,
    decrement: store.decrement
  }),
  render: ({ store, value, increment, decrement }) => (
    <div id="counter">
      <div id="value">{value}</div>
      <div id="increment" onClick={increment}>Increment</div>
      <div id="decrement" onClick={decrement}>Decrement</div>
    </div>
  )
});

/* EXPORT */

export default Counter;
