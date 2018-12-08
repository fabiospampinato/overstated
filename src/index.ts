
/* IMPORT */

import {Provider, Subscribe} from 'unstated';
import compose from 'unstated-compose';
import connect from 'unstated-connect2';
import autosuspend from 'unstated-suspense-autosuspend';
import {Container as BaseContainer} from 'unstated-suspense-middleware';
import HMR from 'unstated-hmr';
import debug from 'unstated-debug';

/* OVERSTATED */

class Container<State extends object = {}, Context extends object | undefined = undefined> extends BaseContainer<State> {

  ctx: Context;
  autosuspend?: false | { bubbles?: number, methods?: RegExp };

  constructor () {

    super ();

    autosuspend ( this );

  }

}

/* EXPORT */

export {Container, Provider, Subscribe, compose, connect, debug, HMR};
