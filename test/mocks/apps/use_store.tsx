
/* IMPORT */

import * as React from 'react';
import {useStore} from '../../../dist';
import appify from '../../utils/appify';
import Store from '../stores/counter';

/* USE STORE */

function UseStore () {

  const {value, increment, decrement} = useStore ( Store, store => ({
    value: store.get (),
    increment: store.increment,
    decrement: store.decrement
  }));

  return (
    <div id="counter">
      <div id="value">{value}</div>
      <div id="increment" onClick={increment}>Increment</div>
      <div id="decrement" onClick={decrement}>Decrement</div>
    </div>
  );

}

/* EXPORT */

export default appify ( UseStore );
