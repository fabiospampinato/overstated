
/* IMPORT */

import {describe} from 'ava-spec';
import {useStore} from '../../dist';
import Store from '../mocks/stores/counter';

/* USE STORE */

//FIXME: Fix this test module

// window['Date'] = Date; // Otherwise `react-hooks-testing-library` throws an error

// describe ( 'useStore', it => {

//   const {renderHook, cleanup, act} = require ( 'react-hooks-testing-library' );

//   it.beforeEach ( t => {

//     t.context.result = renderHook ( () => useStore ( Store, store => ({
//       value: store.get (),
//       increment: store.increment,
//       decrement: store.decrement
//     })));

//   });

//   it.afterEach ( cleanup );

//   it ( 'works', t => {

//     t.is ( t.context.result.current.value, 0 );

//     act ( () => t.context.result.current.increment () );
//     act ( () => t.context.result.current.increment () );

//     t.is ( t.context.result.current.value, '2' );

//     act ( () => t.context.result.current.decrement () );

//     t.is ( t.context.result.current.value, '1' );

//   });

// });
