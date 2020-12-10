import { useEffect, useState, useRef } from "react";
import { useInterval } from "./use-interval";

export function useTimer({delay, onComplete, isPaused, tickUpdater}) {

  const [timeElapsed, setTimeElapsed] = useState(0);
  const [timeRemaining, setTimeRemaining] = useState(null);
  const [timeComplete, setTimeComplete] = useState(false);


  // store latest callback in a Ref
  const savedCallback = useRef();


  // always save updates to the callback
  useEffect(() => {
    savedCallback.current = onComplete;
  }, [onComplete]);


  // cleanup state when delay changes
  useEffect(()=> {
    setTimeElapsed(0);
    setTimeComplete(false);
  }, [delay])


  // Set up the timeout function
  // timer-interval action
  useInterval(() => {
    setTimeElapsed(timeElapsed + 1);    
  }, (isPaused || timeComplete) ? null : 1000);


  // timer-interval side effects
  useEffect(() => {
    const timeRemaining = delay - timeElapsed;
    setTimeRemaining(timeRemaining);

    // call the updater function passed into the hook with fresh time remaining data
    if(tickUpdater) {
      tickUpdater(timeRemaining)
    }
  }, [timeElapsed, delay, tickUpdater]);


  // on timer complete actions
  useEffect(() => {
    if (timeRemaining === 0) {
      setTimeComplete(true);
      // other 'on complete' actions
      // call the callback
      savedCallback.current()
    };
  }, [timeRemaining]);

  return {
    reset: () => { 
      // updating timeElapsed triggers rerenders that
      // recalculate and update timeRemaining automatically
      setTimeElapsed(0); 

      setTimeComplete(false); 
    }
  }
}