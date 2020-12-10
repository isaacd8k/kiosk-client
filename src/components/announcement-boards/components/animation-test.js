import React from 'react';
import styles from "./../announcementboards.module.scss";
import { useState } from "react";
import { motion, useAnimation } from "framer-motion";
import { useTimer } from "./../hooks";



export default function AnimationTest() {
  const [timeRemaining, setTimeRemaining] = useState(null);
  const [slideDuration, setSlideDuration] = useState(10);
  // is any animation running (fwd or rv)
  const [isAnimating, setIsAnimating] = useState(false);
  const [isFwdAnimationComplete, setIsFwdAnimationComplete] = useState(false);
  const [timerIsPaused, setTimerIsPaused] = useState(true);
  const AnimationControls = useAnimation();
  

  const timer = useTimer({
    delay: slideDuration,
    onComplete: () => {
      setTimerIsPaused(true);
      timer.reset();
    },
    isPaused: timerIsPaused,
    tickUpdater: t => setTimeRemaining(t)
  });


  const AnimationTargets = {
    animating: i => ({
      pathLength: 1,
      pathOffset: 0,
      transition: {
        duration: timeRemaining // INSERT LIVE VARIABLE
      }
    }),
  
    // reset or starting value
    reset: {
      pathLength: 1, 
      pathOffset: 1,
      transition: {
        duration: 2
      }
    }
  }

  // utils
  function pauseAnimation() {
    setTimerIsPaused(true);

    // don't pause the reverse animation
    if (isAnimating && isFwdAnimationComplete) {
      return;  
    }
    AnimationControls.stop();
  }

  function playFwdAnimation() {
    // don't rerun an already completed animation
    if (isFwdAnimationComplete) {
      return false;
    }

    // don't rerun a running animation
    if (isAnimating && !timerIsPaused) {
      return false;
    }

    // update our animation state
    setTimerIsPaused(false);
    setIsAnimating(true);
    
    AnimationControls.start("animating").then(() => {
      // update our animation state
      setIsFwdAnimationComplete(true);

      // paginate here or on timer end?
        // paginate

      // animate back to start
      AnimationControls.start("reset").then(() => {
        setIsFwdAnimationComplete(false);
        setIsAnimating(false);
      });
    });
  }


  return (
    <div>

      <div className={styles.svgContainer}>
        <svg
          viewBox="0 0 850 650" 
          className={styles.svg} 
          preserveAspectRatio="none"
        >

          <path
            d="M20 20 H788 V588 H20 z"
            fill="transparent"
            stroke="#f3f3f3"
            strokeWidth="6"
            strokeLinejoin="round"
            strokeLinecap="round"
          />
          <motion.path
            animate={AnimationControls}
            d="M20 20 V588 H788 V20 z"
            fill="transparent"
            stroke="#02b221"
            strokeWidth="6"
            strokeLinejoin="round"
            strokeLinecap="round"
            initial={{ pathLength: 1, pathOffset: 1 }}
            variants={AnimationTargets}
          />
        </svg>
      </div>

      timerIsPaused: {JSON.stringify(timerIsPaused)} isAnimating: {JSON.stringify(isAnimating)} 
      isFwdAnimationComplete: {JSON.stringify(isFwdAnimationComplete)}
      timeRemaining: {timeRemaining}
      <button onClick={()=> { playFwdAnimation() }}>Play Animation</button>
      <button onClick={()=> { pauseAnimation() }}>Pause Animation</button>
      <button onClick={()=> { timer.reset() }}>Reset timer</button>
    </div>
  )
}
