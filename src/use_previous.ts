
/* IMPORT */

import {useEffect, useRef} from 'react';

/* USE PREVIOUS */

//TODO: Publish as `react-use-previous`

function usePrevious ( value ) {

  const ref = useRef ();

  useEffect ( () => {
    ref.current = value;
  }, [value] );

  return ref;

}

/* EXPORT */

export default usePrevious;
