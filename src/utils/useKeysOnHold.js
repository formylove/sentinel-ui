import { useEffect, useRef, useCallback } from 'react';

export default function useKeysOnHold() {
  const keysOnHold = useRef([]);

  useEffect(() => {
    window.addEventListener('keyup', onKeyUp);
    window.addEventListener('keydown', onKeyDown);
    return () => {
      window.removeEventListener('keyup', onKeyUp);
      window.removeEventListener('keydown', onKeyDown);
    };
  }, []);

  const onKeyUp = useCallback((e) => {
    keysOnHold.current.splice(keysOnHold.current.indexOf(e.keyCode), 1);
  }, []);

  const onKeyDown = useCallback((e) => {
    if (keysOnHold.current.indexOf(e.keyCode) < 0) {
      keysOnHold.current.push(e.keyCode);
    }
  }, []);

  return keysOnHold.current;
}
