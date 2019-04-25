import * as React from 'react';
import {render} from 'react-dom';
import {debug, useStore, Store, Provider} from '../dist';

debug ();

const initialValue = 0

class RandomStore extends Store<{ value: number }> {
  state = {
    value: Math.random ()
  }
  randomize = () => {
    return this.setState ({ value: Math.random () });
  }
};

function Random () {
  const {value, randomize} = useStore ( RandomStore, store => ({
    value: store.state.value,
    randomize: store.randomize
  }), { value: initialValue });
  return (
    <div>
      <div>{value}</div>
      <button onClick={randomize}>Randomize</button>
    </div>
  );
}

render (
  <Provider>
    <Random />
  </Provider>,
  document.getElementById ( 'app' )
);
