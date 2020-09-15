import React from "react";
import { useState, useEffect } from "react";
import styles from "./announcementboards.module.scss";
import { motion, AnimatePresence, useMotionValue } from "framer-motion";
import { wrap } from "@popmotion/popcorn";

// custom hooks
import { useInterval } from "./hooks";

// subcomponents
import Slide from "./components/slide";


// dummy data
const data = [
  { id:0, head: "heading t1", content: "lorem ipsum 1" },
  { id:4, head: "heading t2", content: "lorem ipsum 2" },
  { id:7, head: "heading t3", content: "lorem ipsum 3" },
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
  const [activeSlide, setActiveSlide] = useState(0);
  const [slideTimerCount, setSlideTimerCount] = useState(100);
  const [delay, setDelay] = useState(null);
  const [isRunning, setIsRunning] = useState(true);


  // set up default tick delay on initial render
  useEffect(() => setDelay(100), []);
  

  // set up the tick function at configured delay (countdown) - null pauses the countdown
  useInterval(() => {
    setSlideTimerCount((current) => current - 1);
  }, isRunning ? delay : null);


  // react when counter reaches zero, move to next page and reset
  useEffect(() => {
    if (slideTimerCount === 0) {
      paginate(1);
      setSlideTimerCount(100);
    }
  }, [slideTimerCount]);


  // moves the slider `delta` slides forward
  const paginate = (delta) => {    
    setActiveSlide((currentSlide) => (
      // wrap slide increment/decrement around array size
      wrap(0, data.length, currentSlide + delta)
    ));
  };

  const playSlides = () => {
    setIsRunning(true);
  }

  const pauseSlides = () => {
    setIsRunning(false);
  }

  const variants = {
    blankStroke: {
      pathLength: 1,
      pathOffset: 0
    },
    fillStroke: (duration) => ({
      pathLength: 1,
      pathOffset: 1,
      transition: { duration, ease:"linear" }
    })
  }
  

  return (
    <>
      <div className={styles.ab_slidescontainer}>
        <AnimatePresence>
          <motion.div
            className={styles.singleslide_container}
            key={data[activeSlide].id}
            variants={animationStates}
            initial="inactive"
            animate="active"
            exit="inactive"
          >
            <Slide {... data[activeSlide]} />
          </motion.div>          
        </AnimatePresence>
      </div>

      <button onClick={()=> { paginate(-1) }}>Previous slide</button>
      <button onClick={()=> { paginate(1) } }>Next slide</button>
      <button onClick={()=> pauseSlides() }>Pause slides</button>
      <button onClick={()=> playSlides() }>Play slides</button>

      <div>Countdown: {slideTimerCount}</div>



      <div className={styles.svgContainer}>
        <motion.svg
          viewBox="0 0 850 650" 
          className={styles.svg} 
          preserveAspectRatio="none"
        >

          <path
            d="M20 20 H788 V588 H20 z"
            fill="transparent"
            stroke="green"
            strokeWidth="6"
            strokeLinejoin="round"
            strokeLinecap="round"
          />
          <motion.path
            d="M20 20 H788 V588 H20 z"
            fill="transparent"
            stroke="#f3f3f3"
            strokeWidth="6"
            strokeLinejoin="round"
            strokeLinecap="square"
            variants={variants}
            initial="blankStroke"
            animate="fillStroke"
            custom={25}
          />
        </motion.svg>
      </div>
    </>
  )
}
