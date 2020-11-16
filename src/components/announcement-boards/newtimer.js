import React, { useState, useEffect } from 'react';
import { useTimer } from './hooks/use-timer';


export default function NewTimer() {
  const [timerDuration, setTimerDuration] = useState(5);
  const [timeRemaining, setTimeRemaining] = useState();  
  const [timerIsPaused, setTimerIsPaused] = useState(true);

  // new interface ideas hmm:
  const { reset: resetTimer } = useTimer({
    delay: timerDuration,
    onComplete: onTimerComplete, 
    isPaused: timerIsPaused, // sync with state 
    tickUpdater: updateTimeRemaining
  });


  function onTimerComplete() {
    console.log('new timer complete!');
    setTimerIsPaused(true);
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
