import { useEffect, useRef } from "react";


export function useInterval(callback, delay) {
  const savedCallback = useRef();

  useEffect(() => {
    savedCallback.current = callback;
  });

  useEffect(() => {
    function tick() {
      console.log('tick!');
      savedCallback.current();
    }

    if (delay !== null) {
      let id = setInterval(tick, delay);
      return () => {
        clearInterval(id);
        console.log(`cleaning up timer ${id}`);
      };
    }
  }, [delay]);
}