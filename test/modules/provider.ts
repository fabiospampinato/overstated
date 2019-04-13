
/* IMPORT */

import {describe} from 'ava-spec';
import {mount} from '../utils/enzyme';
import Mocks from '../mocks/provider';
import App from '../mocks/stores/app';
import Counter from '../mocks/stores/counter';

/* PROVIDER */

describe ( 'Provider', it => {

  describe ( 'inject', it => {

    it ( 'can override a default class store', t => {

      const store = Counter,
            injected = new Counter ();

      injected.state.value = 123;

      const html = mount ( Mocks.app.single ( store, injected )({}) ).html ();

      t.is ( html, '<div>123</div>' );

    });

    it ( 'can override a default instance store', t => {

      const store = new Counter (),
            injected = new Counter ();

      injected.state.value = 123;

      const html = mount ( Mocks.app.single ( store, injected )({}) ).html ();

      t.is ( html, '<div>123</div>' );

    });

    it.skip ( 'can override child stores in composed stores', t => { //FIXME

      const store = new App (),
            injected = new Counter ();

      injected.state.value = 123;

      const html = mount ( Mocks.app.compose ( store, injected )({}) ).html ();

      t.is ( html, '<div>123</div>' );

    });

  });

});
