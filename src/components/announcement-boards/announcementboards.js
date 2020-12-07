import React from "react";
import { useState, useEffect } from "react";
import styles from "./announcementboards.module.scss";
import { motion, AnimatePresence, useAnimation } from "framer-motion";
import { wrap } from "@popmotion/popcorn";

// custom hooks
import { useTimer } from "./hooks";

// subcomponents
import Slide from "./components/slide";


// dummy data
const data = [
  { id:0, head: "heading t1", content: "lorem ipsum 1" },
  { id:4, head: "heading t2", content: "lorem ipsum 2", duration: 8 },
  { id:7, head: "heading t3", content: "lorem ipsum 3", duration: 20 },
  { id:2, head: "heading t4", content: "lorem ipsum 4" },
];

// animation states (later all app anims to be abstracted into separate file)
const animationStates = {
  "inactive": {
    opacity: 0,
    transition: {
      duration: 0.5
    }
  },
  "active": {
    opacity: 1,
    transition: {
      duration: 1,
      delay: 1
    }
  }
};




export default function AnnouncementBoards() {
  const [slides, setSlides] = useState(data);
  const [slidesArePaused, setSlidesArePaused] = useState(true);
  const [currentSlideComplete, setCurrentSlideComplete] = useState(false);
  const [activeSlideIndex, setActiveSlideIndex] = useState(undefined);
  const [timeRemaining, setTimeRemaining] = useState(null);

  const timerAnimationControls = useAnimation();

  /*
    ***** bug watch *****
    -- Note that if the activeSlideIndex is 0, JS coerces the type into
    -- numeric when used with numeric operators such as > and >=.
    -- Therefore, we have set up the state to start out as undefined
    -- so that these numeric operators can be used as numeric 
    -- comparators below
  */

  // on mount, start slides by showing the first slide
  useEffect(() => {
    // initiate first slide
    setActiveSlideIndex(0);

    // 'play' the slides!
    setSlidesArePaused(false);
  }, [slides])


  // setup custom hook timer
  const { reset: resetTimer } = useTimer({
    delay: 10,
    onComplete: ()=>{
      setSlidesArePaused(true);
      setCurrentSlideComplete(true);

      paginate(1);
    },
    isPaused: slidesArePaused,
    tickUpdater: t => setTimeRemaining(t)
  });
  

  /* UTILITY FUNCTIONS */
  // moves the slider `delta` slides forward
  const paginate = (delta) => {    
    setActiveSlideIndex((currentSlide) => (
      // wrap slide increment/decrement around array size
      wrap(0, slides.length, currentSlide + delta)
    ));

    // sequence animation
    // slide fade animation
    // THEN reset our timer state (i.e. isComplete & isPause)
    
    setSlidesArePaused(false);
  };


  // start the animation

  // SYNC THE ANIMATION WITH THE TIMER
  // ** play/pause ** //
  useEffect(() => {
    if(slidesArePaused) {
      // PAUSE
      // pause the animation
      timerAnimationControls.stop();
    }

    else if (currentSlideComplete) {
      // HAS BEEN UNPAUSED AFTER COMPLETE
      

      // bug problem! out of sync with timer!! because this func is async
      // maybe defer timer reset to "start" here instead of up there
      
      timerAnimationControls.start("reset").then(() => {
        setCurrentSlideComplete(false);
        resetTimer();
        setTimeRemaining(10);
        // I think start is animating extremely quickly to completeion because of 
        // stale timeRemaining state, i.e. at 0 (or maybe this function runs at the wrong time)
        timerAnimationControls.start("start");
      });

      // cleanup function
    }
    
    else {
      // HAS BEEN UNPAUSED
      timerAnimationControls.start("start");
      // cleanup function
    }

    console.log('CURRENTSLIDECOMPLETE: ', currentSlideComplete);

      // research resetTimer() => should this be memoized?
      // the animation stutters at every second because
      // after every second, the hook is rerun and the value returned
      // by it (the resetTimer function) is redefined. That triggers this 
      // hook to rerender
  }, [slidesArePaused, currentSlideComplete, timerAnimationControls]);


  // VARIANTS
  // function is called at the moment the variant is animated to
  const timerAnimationVariants = {
    start: i => ({
      pathLength: 1,
      pathOffset: 0,
      transition: {
        duration: timeRemaining
      }
    }),

    reset: {
      pathLength: 1, 
      pathOffset: 1,
      transition: {
        duration: 2
      }
    }
  }


  return (
    <>
      <div className={styles.ab_slidescontainer}>
        { (activeSlideIndex >= 0) &&
          <AnimatePresence>
            <motion.div
              className={styles.singleslide_container}
              key={data[activeSlideIndex].id}
              variants={animationStates}
              initial="inactive"
              animate="active"
              exit="inactive"
            >
              <Slide {... data[activeSlideIndex]} />
            </motion.div>
          </AnimatePresence>
        }
      </div>

      <button onClick={()=> { paginate(-1) }}>Previous slide</button>
      <button onClick={()=> { paginate(1) } }>Next slide</button>
      <button onClick={()=> { setSlidesArePaused(true); }}>Pause slide</button>
      <button onClick={()=> { setSlidesArePaused(false); }}>Start/Resume</button>
      <button onClick={()=> { resetTimer(); }}>Reset timer</button>
      <span>{timeRemaining}</span>
      <span>current slide is complete: { currentSlideComplete.toString() }</span>



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
            animate={ timerAnimationControls }
            d="M20 20 V588 H788 V20 z"
            fill="transparent"
            stroke="#02b221"
            strokeWidth="6"
            strokeLinejoin="round"
            strokeLinecap="round"
            initial={{ pathLength: 1, pathOffset: 1 }}
            variants={ timerAnimationVariants }
          />
        </svg>
      </div>
    </>
  )
}
