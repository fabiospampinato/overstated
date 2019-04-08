
/* IMPORT */

import {describe} from 'ava-spec';
import {render} from '../utils/enzyme';
import NoProvider from '../mocks/apps/no_provider';

/* NO PROVIDER */

describe ( 'No Provider', it => {

  it ( 'throws an error', async t => {

    t.throws ( () => render ( NoProvider ({}) ), 'You probably forgot to wrap your app with <Provider>' );

  });

});
