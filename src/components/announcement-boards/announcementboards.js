import React from "react";
import { useState, useEffect, useRef } from "react";
import styles from "./announcementboards.module.scss";
import { motion, AnimatePresence } from "framer-motion";
import { wrap } from "@popmotion/popcorn";

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
  const [slideTimerCount, setSlideTimerCount] = useState(5);
  
  const tickCallback = useRef();


  // generic useEffect hook 
  useEffect(()=> {
    console.log('hook called on every re-render');
  });


  // set default callback behavior only upon first render
  useEffect(()=> {
    tickCallback.current = () => setSlideTimerCount((prev) => prev-1);
  }, []);
  

  useEffect(() => {
    console.log(`ran useEffect(), watching slideTimerCount: ${slideTimerCount}`);

    // check if we reached 0 yet
    if (slideTimerCount > 0) {
      const id = setTimeout(() => {
        tickCallback.current();
      }, 1000);

      return () => {
        clearTimeout(id)
      }
    }
    
    return;
  }, [slideTimerCount])


  // react when counter reaches zero, move to next page and reset
  useEffect(() => {
    if (slideTimerCount === 0) {
      paginate(1);
      setSlideTimerCount(5);
    }
  }, [slideTimerCount]);


  const playSlides = () => {
    setSlideTimerCount((p)=>p-1)
    tickCallback.current = () => setSlideTimerCount((prev)=>prev-1);
  }

  const pauseSlides = () => {
    tickCallback.current = () => null;
  }

  // paginate accepts the direction (sign) and size of jump in
  // active slide number and moves delta steps
  const paginate = (delta) => {
    // wrap slide increment/decrement around array size
    const newSlideIndex = wrap(0, data.length, activeSlide + delta);
    setActiveSlide(newSlideIndex);
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
    </>
  )
}
