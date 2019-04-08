
/* IMPORT */

import * as React from 'react';
import Context from './context';

/* PROVIDER */

const Provider = ( { inject, children }: { inject?: StoreType[], children: React.ReactNode } ) => (
  <Context.Consumer>
    {parentMap => {

      const map = parentMap ? new Map ( parentMap ) : new Map ();

      if ( inject ) {

        inject.forEach ( instance => map.set ( instance.constructor, instance ) );

      }

      return (
        <Context.Provider value={map}>
          {children}
        </Context.Provider>
      );

    }}
  </Context.Consumer>
);

/* EXPORT */

export default Provider;
