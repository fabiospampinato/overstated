
/* IMPORT */

import {useEffect, useRef} from 'react';

/* USE PREVIOUS */

function usePrevious ( value ) {

  const ref = useRef ();

  useEffect ( () => {
    ref.current = value;
  }, [value] );

  return ref.current;

}

/* EXPORT */

export default usePrevious;
