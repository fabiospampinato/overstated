
/* IMPORT */

import {describe} from 'ava-spec';
import spy from 'call-spy';
import {Hooks, Store} from '../../dist';

/* HOOKS */

describe ( 'Hooks', it => {

  describe ( 'store.new', it => {

    it ( 'calls each handler when a new store is created', t => {

      const [handler, res] = spy ( () => {} ),
            [handler2, res2] = spy ( () => {} );

      Hooks.store.new.subscribe ( handler );
      Hooks.store.new.subscribe ( handler );
      Hooks.store.new.subscribe ( handler2 );
      Hooks.store.new.subscribe ( handler2 );

      const store = new Store ();

      t.is ( res.calls, 1 );
      t.is ( res.arguments[0], store );
      t.is ( res2.calls, 1 );
      t.is ( res2.arguments[0], store );

    });

  });

});
