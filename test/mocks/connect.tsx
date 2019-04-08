
/* IMPORT */

import * as React from 'react';

/* MOCKS */

const Mocks = {

  render: {

    functional: ({ store }) => <div>{store && store.get ()}</div>,

    component: class Component extends React.Component<any, any> {
      render () {
        return <div>{this.props.store && this.props.store.get ()}</div>;
      }
    },

    fragment: ({ stores }) => (
      <>
        <div>{stores && stores[0].get ()}</div>
        <span>{stores && stores[1].get ()}</span>
      </>
    ),

    map: ({ stores }) => [
      <div key="0">{stores && stores[0].get ()}</div>,
      <span key="1">{stores && stores[1].get ()}</span>
    ],

    passthrough: ({ prop }) => <div>{prop}</div>,

    selector: ({ value }) => (
      <div>
        <span id="value">{value}</span>
        <span id="random">{Math.random ()}</span>
      </div>
    )

  },

  selector: ({ store }) => ({ value: store.get () })

};

/* EXPORT */

export default Mocks;
