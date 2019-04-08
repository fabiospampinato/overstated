
/* IMPORT */

import * as React from 'react';
import {Provider} from '../../dist';

/* APPIFY */

const appify = ( Root, rootOptions = {} ): React.FunctionComponent<any> => {

  return () => (
    <Provider>
      <Root {...rootOptions} />
    </Provider>
  );

};

/* EXPORT */

export default appify;
