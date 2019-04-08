
/* IMPORT */

import {describe} from 'ava-spec';
import connectify from '../utils/connectify';
import {mount, shallow} from '../utils/enzyme';
import htmlify from '../utils/htmlify';
import Mocks from '../mocks/connect';
import Counter from '../mocks/stores/counter';

/* CONNECT */

describe ( 'connect', it => {

  describe ( 'rendering', it => {

    it ( 'can render functional components', t => {

      t.is ( htmlify ( {}, Mocks.render.functional ), '<div></div>' );

    });

    it ( 'can render class components', t => {

      t.is ( htmlify ( {}, Mocks.render.component ), '<div></div>' );

    });

    it ( 'can render fragments', t => {

      t.is ( htmlify ( {}, Mocks.render.fragment, shallow ), '<div></div><span></span>' );

    });

    it ( 'can render maps', t => {

      t.is ( htmlify ( {}, Mocks.render.map, shallow ), '<div></div><span></span>' );

    });

  });

  describe ( 'options', it => {

    it ( 'store (class)', t => {

      t.is ( htmlify ( Counter, Mocks.render.functional ), '<div>0</div>' );

    });

    it ( 'store (instance)', t => {

      const store = new Counter ();

      store.state.value = 123;

      t.is ( htmlify ( store, Mocks.render.functional ), '<div>123</div>' );

    });

    it ( 'store option (class)', t => {

      t.is ( htmlify ( { store: Counter }, Mocks.render.functional ), '<div>0</div>' );

    });

    it ( 'store option (instance)', t => {

      const store = new Counter ();

      store.state.value = 123;

      t.is ( htmlify ( { store }, Mocks.render.functional ), '<div>123</div>' );

    });

    it ( 'stores option (classes)', t => {

      const stores = [Counter, Counter];

      t.is ( htmlify ( { stores }, Mocks.render.map, shallow ), '<div>0</div><span>0</span>' );

    });

    it ( 'stores options (instances)', t => {

      const stores = [new Counter (), new Counter ()];

      stores[0].state.value = 123;
      stores[1].state.value = 321;

      t.is ( htmlify ( { stores }, Mocks.render.map, shallow ), '<div>123</div><span>321</span>' );

    });

    it ( 'render option (functional)', t => {

      t.is ( htmlify ({ store: Counter, render: Mocks.render.functional }), '<div>0</div>' );

    });

    it ( 'render option (class)', t => {

      t.is ( htmlify ({ store: Counter, render: Mocks.render.component }), '<div>0</div>' );

    });

    it ( 'render option (fragment)', t => {

      t.is ( htmlify ( {render: Mocks.render.fragment}, undefined, shallow ), '<div></div><span></span>' );

    });

    it ( 'render option (map)', t => {

      t.is ( htmlify ( {render: Mocks.render.map}, undefined, shallow ), '<div></div><span></span>' );

    });

    it ( 'selector option', async t => {

      const getText = ( app, selector ) => app.find ( selector ).text (),
            getValue = app => getText ( app, '#value' ),
            getRandom = app => getText ( app, '#random' );

      const store = new Counter (),
            app = mount ( connectify ( { store, selector: Mocks.selector }, Mocks.render.selector )({}) );

      const random = getRandom ( app );

      t.is ( getValue ( app ), '0' );

      await store.setState ({ value: 0 });

      t.is ( getRandom ( app ), random );

      await store.setState ({ foo: true });

      t.is ( getRandom ( app ), random );

      await store.setState ({ foo: false });

      t.is ( getRandom ( app ), random );

      await store.increment ();

      const random2 = getRandom ( app );

      t.is ( getValue ( app ), '1' );
      t.true ( random2 !== random );

    });

  });

  it ( 'passes along the options it receives', t => {

    const store = new Counter (),
          app = mount ( connectify ( { store }, Mocks.render.passthrough, { prop: 123 } )({}) );

    t.is ( app.html (), '<div>123</div>' );

  });

  it ( 're-renders the component when the state changes', async t => {

    const store = new Counter ();

    t.is ( store.listeners.length, 0 );

    const app = mount ( connectify ( { store }, Mocks.render.functional )({}) );

    t.is ( app.html (), '<div>0</div>' );
    t.is ( store.listeners.length, 1 );

    await store.setState ({ value: 0 });

    t.is ( app.html (), '<div>0</div>' );
    t.is ( store.listeners.length, 1 );

    store.state.value = 123;

    t.is ( app.html (), '<div>0</div>' );
    t.is ( store.listeners.length, 1 );

    await store.increment ();

    t.is ( app.html (), '<div>124</div>' );
    t.is ( store.listeners.length, 1 );

    await store.decrement ();

    t.is ( app.html (), '<div>123</div>' );
    t.is ( store.listeners.length, 1 );

  });

});
