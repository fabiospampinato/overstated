
import * as React from 'react';
import {render} from 'react-dom';
import {compose, debug, useStore, Store, Provider} from '../dist';

debug ();

class RandomStore extends Store<{ value: number }> {
  state = {
    value: Math.random ()
  }
  randomize = () => {
    return this.setState ({ value: Math.random () });
  }
};

@compose ({ random: RandomStore }) // Using "compose" just for testing purposes
class App extends Store<{}, undefined, { random: RandomStore }> {}

function Random () {
  const {value, randomize} = useStore ( App, app => ({
    value: app.random.state.value,
    randomize: app.random.randomize
  }));
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
