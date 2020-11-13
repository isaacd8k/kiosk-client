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

function useEnhancedTimeout(callback, delay, timeRemainingUpdater) {
  console.log(`Called useEnhancedTimeout hook; delay: ${delay} `);

  const [timeElapsed, setTimeElapsed] = useState(0);
  const [timeRemaining, setTimeRemaining] = useState(null);
  const [isPaused, setIsPaused] = useState(true);

  // store latest callback in a Ref
  const savedCallback = useRef();


  // Always save updates to the callback
  useEffect(() => {
    console.log('Inside hook: callback watcher useEffect()');
    savedCallback.current = callback;
  }, [callback]);


  // Set up the timeout function
  // timer-interval action
  useInterval(() => {
    console.log('Inside hook: useInterval hook() callback');
    setTimeElapsed(timeElapsed + 1);    
  }, isPaused ? null : 1000);


  // currently: trying to find a way to minimize rerenders
  // when the hook is initially called, it unnecessarily causes
  // an extra rerender in the component, and it comes from this 
  // function:


  // timer-interval side effects
  useEffect(() => {
    console.log('Inside hook: params watcher useEffect()');
    const timeRemaining = delay - timeElapsed;
    setTimeRemaining(timeRemaining);

    // call the updater function passed into the hook with fresh time remaining data
    if(timeRemainingUpdater) {
      console.log('Called the timer-interval side effects function!', timeRemaining)
      timeRemainingUpdater(timeRemaining)
    }
  }, [timeElapsed, delay, timeRemainingUpdater]);


  // on timer complete actions
  useEffect(() => {
    console.log('Inside hook: internal state timeRemaining watcher useEffect()');
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
  }

  // resume action
  function resumeTimer() {
    setIsPaused(false);
  }

  // reset timer to default time
  function resetTimer() {
    // make sure the timer is paused
    setIsPaused(true);
    // reset elapsed time back to 0
    setTimeElapsed(0);
  }

  return {
    pause: pauseTimer,
    reset: resetTimer,
    start: resumeTimer
  }
}


function useNewTimerHook({delay, onComplete, isPaused, tickUpdater}) {

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
      setTimeElapsed(0);
    }
  }
}


export default function NewTimer() {
  const [timerDuration, setTimerDuration] = useState(5);
  const [timeRemaining, setTimeRemaining] = useState();  
  const [timerIsPaused, setTimerIsPaused] = useState(true);

  // new interface ideas hmm:
  const { reset: resetTimer } = useNewTimerHook({
    delay: timerDuration,
    onComplete: onTimerComplete, 
    isPaused: timerIsPaused, // sync with state 
    tickUpdater: updateTimeRemaining
  });


  function onTimerComplete() {
    console.log('new timer complete!');
  }

  function updateTimeRemaining(t) {
    setTimeRemaining(t);
  }

  function pauseTimer() {
    setTimerIsPaused(true);
  }

  function resumeTimer() {
    setTimerIsPaused(false);
  }

  useEffect(()=> {
    console.log('PARENT COMPONENT RENDER');
  });

 

  return (
    <div>
      <div>Timer duration: { timerDuration }</div>
      <div>Time remaining: { timeRemaining }</div>
      <input type="number" value={ timerDuration } onChange={(e) => { setTimerDuration(e.target.value) }}></input>


      <button onClick={() => { pauseTimer() }}>PAUSE</button>
      <button onClick={() => { resumeTimer() }}>RESUME</button>
      <button onClick={() => { resetTimer() }}>RESET TIMER</button>
    </div>
  )
}
