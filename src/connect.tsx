
/* IMPORT */

import * as React from 'react';
import {FunctionComponent, Component, StoreType, StoreLike, ConnectOptionsObj, ConnectOptions, ConnectProps, ConnectData, ContextMap} from './types';
import Context from './context';
import Store from './store';
import {DUMMY_OBJ, DUMMY_ARR, getStoreInstance, isShallowEqual} from './utils';

/* CONNECT COMPONENT */

class Connect extends React.Component<{ options: ConnectOptionsObj, context: ContextMap, component: Component, componentProps: {} }, {}> {

  /* VARIABLES */

  mounted: boolean = false;
  data: ConnectData = [{}, []];
  dataInited: boolean = false;

  /* LIFECYCLE */

  componentDidMount () {

    this.mounted = true;

  }

  componentWillUnmount () {

    this.mounted = false;

    this.unsubscribe ();

  }

  shouldComponentUpdate ( nextProps ) {

    const nextData = this.getData ( nextProps ),
          shouldUpdate = !this.props.options.selector || !isShallowEqual ( this.data[0], nextData[0] );

    this.updateData ( nextData );

    return shouldUpdate;

  }

  /* EVENTS */

  onUpdate = () => {

    return new Promise ( res => {
      if ( !this.mounted ) return res ();
      this.setState ( DUMMY_OBJ, res );
    });

  }

  /* API */

  unsubscribe () {

    this.updateSubscriptions ( this.data[1], DUMMY_ARR );

  }

  updateSubscriptions ( unsubscribe: StoreType[], subscribe: StoreType[] ) {

    if ( unsubscribe.length === subscribe.length && unsubscribe.every ( ( store, index ) => store === subscribe[index] ) ) return; // The most common scenario after the first render: nothing changes

    for ( let i = 0, l = unsubscribe.length; i < l; i++ ) {

      const store = unsubscribe[i];

      if ( subscribe.indexOf ( store ) >= 0 ) continue; // It will be re-subscribed-to later on

      store.unsubscribe ( this.onUpdate );

    }

    for ( let i = 0, l = subscribe.length; i < l; i++ ) {

      subscribe[i].subscribe ( this.onUpdate );

    }

  }

  initData () {

    if ( this.dataInited ) return;

    this.updateData ( this.getData () );

    this.dataInited = true;

  }

  updateData ( data: ConnectData ) {

    this.updateSubscriptions ( this.data[1], data[1] );

    this.data = data;

  }

  getData ( { options, componentProps } = this.props ): ConnectData {

    const {selector, store, stores} = options;

    let props: ConnectProps = componentProps,
        instances: StoreType[] = [];

    if ( store ) {

      props.store = getStoreInstance ( this.props.context, store );

      instances.push ( props.store );

    }

    if ( stores ) {

      props.stores = stores.map ( store => getStoreInstance ( this.props.context, store ) );

      instances = instances.concat ( props.stores );

    }

    if ( selector ) {

      props = selector ( props );

    }

    return [props, instances];

  }

  /* RENDER */

  render () {

    if ( !this.dataInited ) this.initData ();

    return React.createElement ( this.props.component, this.data[0] as any ); //TSC

  }

}

/* CONNECT FUNCTION */

function connect ( options: ConnectOptionsObj & Pick<ConnectOptionsObj, 'render'> ): FunctionComponent;
function connect ( options: StoreLike | ConnectOptionsObj ): ( Component: Component ) => FunctionComponent;
function connect ( options: ConnectOptions = {} ) {

  if ( typeof options === 'function' || options instanceof Store ) options = { store: options };

  function wrapper ( Component: Component ): FunctionComponent {

    return props => (
      <Context.Consumer>
        {context => {
          if ( !context ) throw new Error ( 'You probably forgot to wrap your app with <Provider>' );
          return <Connect options={options as ConnectOptionsObj} context={context} component={Component} componentProps={Object.assign ( {}, props )} />
        }}
      </Context.Consumer>
    );

  }

  return options.render ? wrapper ( options.render ) : wrapper;

}

/* EXPORT */

export default connect;
