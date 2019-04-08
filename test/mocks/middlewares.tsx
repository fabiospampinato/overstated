
/* IMPORT */

import * as React from 'react';

/* MOCKS */

const Mocks = {

  middlewares: {

    doubler: function ( prevState ) {
      if ( prevState.value ) return;
      return this.setState ({ value: this.get () * 2 });
    },

    noop: function () {}

  },

  render: ({ store }) => <div>{store && store.get ()}</div>

};

/* EXPORT */

export default Mocks;
