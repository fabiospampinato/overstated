
/* IMPORT */

import Subscriber from './subscriber';

/* HOOKS */

const Hooks = {

  store: {

    new: new Subscriber<[StoreType]> ()

  }

};

/* EXPORT */

export default Hooks;
