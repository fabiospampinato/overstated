
/* IMPORT */

import * as React from 'react';
import connectify from '../utils/connectify';

/* MOCKS */

const Mocks = {

  render: ({ store }) => <div>{store && store.get ()}</div>,

  app ( store, injectedStore ) {

    return connectify ( { store }, Mocks.render, {}, [injectedStore] );

  }

};

/* EXPORT */

export default Mocks;
