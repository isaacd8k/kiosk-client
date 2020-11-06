import React, { useState, useEffect, useRef } from 'react';


function useInterval(callback, delay) {
  const savedCallback = useRef();

  // Remember the latest callback.
  useEffect(() => {
    savedCallback.current = callback;
    console.log('callback useEffect() ran!');
  }, [callback]);

  // Set up the interval.
  useEffect(() => {
    console.log('interval useEffect() ran!');
    function tick() {
      savedCallback.current();
    }
    if (delay !== null) {
      let id = setInterval(tick, delay);
      return () => clearInterval(id);
    }
  }, [delay]);
}



export default function NewTimer() {
  // New timer implementation details
  const [timerDuration, setTimerDuration] = useState(15);
  const [timeElapsed, setTimeElapsed] = useState(0);
  const [timeRemaining, setTimeRemaining] = useState(null);
  const [isPaused, setIsPaused] = useState(false);

  const [inputVal, setInputVal] = useState(null);


  // timer-interval action
  useInterval(() => {
    setTimeElapsed(timeElapsed + 1);
  }, isPaused ? null : 1000);

  // timer-interval side effects
  useEffect(() => {
    setTimeRemaining(timerDuration - timeElapsed);
  }, [timerDuration, timeElapsed]);

  // on timer complete actions
  useEffect(() => {
    if (timeRemaining === 0) {
      setIsPaused(true);
    };
  }, [timeRemaining]);




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


  return (
    <div>

      <div>Timer duration: { timerDuration }</div>
      <div>Timer elapsed time: { timeElapsed }</div>
      <div>Timer remaining time: { timeRemaining }</div>
      <div>Random input val: { inputVal }</div>
      <input type="text" val={inputVal} onChange={(e) => { setInputVal(e.target.value) }}></input>


      <button onClick={() => { pauseTimer() }}>PAUSE</button>
      <button onClick={() => { resumeTimer() }}>RESUME</button>
      <button onClick={() => { resetTimer() }}>RESET TIMER</button>
    </div>
  )
}
