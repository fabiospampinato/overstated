
/* IMPORT */

import connectify from './connectify';
import {mount} from './enzyme';

/* HTMLIFY */

const htmlify = ( options?, component?, renderer = mount ) => {

  return renderer ( connectify ( options, component )({}) ).html ();

};

/* EXPORT */

export default htmlify;
