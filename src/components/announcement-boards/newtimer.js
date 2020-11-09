import React, { useState, useEffect, useRef } from 'react';


function useInterval(callback, delay) {
  const savedCallback = useRef();

  // Remember the latest callback.
  useEffect(() => {
    savedCallback.current = callback;
  }, [callback]);

  // Set up the interval.
  useEffect(() => {    
    function tick() {
      savedCallback.current();
    }
    if (delay !== null) {      
      let id = setInterval(tick, delay);
      console.log(`useInterval hook: creating the interval! ${id}`);
      return () => {
        console.log(`useInterval hook: clearing the interval! ${id}`);
        clearInterval(id);
      }
    }
  }, [delay]);
}

// set conditions for delay to check for endless timer loops
// (e.g. the timeRemaining has already passed 0 and thus will never
// trigger the === 0 statement; empty delays or 0 delays or negative delays or invalid delays)
// is it really necessary to allow for live updating of timer... maybe not. Maybe whenever it changes
// it should automatically reset??? 

function useEnhancedTimeout(callback, delay) {
  console.log(`Called useEnhancedTimeout hook; delay: ${delay} `);

  // New timer implementation details
  const [timerDuration, setTimerDuration] = useState(delay);
  const [timeElapsed, setTimeElapsed] = useState(0);
  const [timeRemaining, setTimeRemaining] = useState(null);
  const [isPaused, setIsPaused] = useState(true);

  // store latest callback in a Ref
  const savedCallback = useRef();


  // Always save updates to the callback
  useEffect(() => {
    savedCallback.current = callback;
  }, [callback]);


  // Set up the timeout function
  // timer-interval action
  useInterval(() => {
    setTimeElapsed(timeElapsed + 1);
  }, isPaused ? null : 1000);


  // timer-interval side effects
  useEffect(() => {
    setTimeRemaining(delay - timeElapsed);
  }, [timeElapsed, delay]);


  // on timer complete actions
  useEffect(() => {
    if (timeRemaining === 0) {
      setIsPaused(true);
      // other 'complete' actions

      // call the callback
      savedCallback.current()
    };
  }, [timeRemaining]);



  // TIMER ACTIONS
  // pause action
  function pauseTimer() {
    setIsPaused(true);
    return getTimeRemaining();
  }

  // resume action
  function resumeTimer() {
    setIsPaused(false);
    return getTimeRemaining();
  }

  // reset timer to default time
  function resetTimer() {
    // make sure the timer is paused
    setIsPaused(true);
    // reset elapsed time back to 0
    setTimeElapsed(0);

    return getTimeRemaining();
  }

  function getTimeRemaining() {
    return 'Time remaining here';    
  }

  // returns remaining time or somehow communicates it to the component
  return {
    pause: pauseTimer,
    reset: resetTimer,
    start: resumeTimer,
    timeRemaining: getTimeRemaining
  }
}



export default function NewTimer() {
  const [timerDuration, setTimerDuration] = useState(5);


  const { pause: pauseTimer, 
          reset: resetTimer, 
          start: resumeTimer, 
          timeRemaining: getTimeRemaining } = useEnhancedTimeout(() => { console.log('Timer fired!') }, timerDuration);


  return (
    <div>

      <div>Timer duration: { timerDuration }</div>
      <input type="number" value={ timerDuration } onChange={(e) => { setTimerDuration(e.target.value) }}></input>


      <button onClick={() => { pauseTimer() }}>PAUSE</button>
      <button onClick={() => { resumeTimer() }}>RESUME</button>
      <button onClick={() => { resetTimer() }}>RESET TIMER</button>
    </div>
  )
}
