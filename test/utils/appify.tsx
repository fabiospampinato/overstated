
/* IMPORT */

import * as React from 'react';
import {Provider} from '../../dist';

/* APPIFY */

const appify = ( Root, rootOptions = {}, inject = [] ): React.FunctionComponent<any> => {

  return () => (
    <Provider inject={inject}>
      <Root {...rootOptions} />
    </Provider>
  );

};

/* EXPORT */

export default appify;
