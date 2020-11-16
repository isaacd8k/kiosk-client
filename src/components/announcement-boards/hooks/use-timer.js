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
    console.log('Inside hook: callback watcher useEffect()');
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
    console.log('Inside hook: useInterval hook() callback');
    setTimeElapsed(timeElapsed + 1);    
  }, (isPaused || timeComplete) ? null : 1000);


  // timer-interval side effects
  useEffect(() => {
    console.log('Inside hook: params watcher useEffect()');
    const timeRemaining = delay - timeElapsed;
    setTimeRemaining(timeRemaining);

    // call the updater function passed into the hook with fresh time remaining data
    if(tickUpdater) {
      console.log('Called the timer-interval side effects function!', timeRemaining)
      tickUpdater(timeRemaining)
    }
  }, [timeElapsed, delay, tickUpdater]);


  // on timer complete actions
  useEffect(() => {
    console.log('Inside hook: internal state timeRemaining watcher useEffect()');
    if (timeRemaining === 0) {
      setTimeComplete(true);
      // other 'complete' actions

      // call the callback
      savedCallback.current()
    };
  }, [timeRemaining]);

  return {
    reset: () => { 
      setTimeRemaining(delay);
      setTimeComplete(false);
      setTimeElapsed(0);
    }
  }
}