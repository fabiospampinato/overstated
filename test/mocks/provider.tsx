
/* IMPORT */

import * as React from 'react';
import connectify from '../utils/connectify';

/* MOCKS */

const Mocks = {

  render: {

    single: ({ store }) => <div>{store && store.get ()}</div>,

    compose: ({ store }) => <div>{store && store.counter && store.counter.get ()}</div>

  },

  app: {

    single: ( store, injectedStore ) => connectify ( { store }, Mocks.render.single, {}, [injectedStore] ),

    compose: ( store, injectedStore ) => connectify ( { store }, Mocks.render.compose, {}, [injectedStore] ),

  }

};

/* EXPORT */

export default Mocks;
