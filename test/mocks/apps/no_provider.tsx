
/* IMPORT */

import * as React from 'react';
import {connect} from '../../../dist';
import Store from '../stores/counter';

/* NO PROVIDER */

const NoProvider = connect ({
  store: Store,
  render: () => <div></div>
});

/* EXPORT */

export default NoProvider;
