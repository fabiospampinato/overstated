
/* IMPORT */

import {connect} from '../../dist';
import appify from './appify';

/* CONNECTIFY */

const connectify = ( options?, component?, componentOptions? ) => {

  const connected = connect ( options ),
        root = component ? ( connected as any )( component ) : connected;

  return appify ( root, componentOptions );

};

/* EXPORT */

export default connectify;
