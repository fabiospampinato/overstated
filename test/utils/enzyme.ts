
/* IMPORT */

import * as Enzyme from 'enzyme';
import {mount, render, shallow} from 'enzyme';
import * as Adapter from 'enzyme-adapter-react-16';

Enzyme.configure ({ adapter: new Adapter () });

/* EXPORT */

export {mount, render, shallow};
