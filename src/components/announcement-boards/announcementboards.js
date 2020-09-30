import React from "react";
import { useState, useEffect, useCallback, useMemo, useRef } from "react";
import styles from "./announcementboards.module.scss";
import { motion, AnimatePresence, useAnimation } from "framer-motion";
import { wrap } from "@popmotion/popcorn";

// custom hooks
// import { useInterval } from "./hooks";

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
  const [activeSlideIndex, setActiveSlideIndex] = useState(undefined);
  

  /*
    ***** bug watch *****
    -- Note that if the activeSlideIndex is 0, JS coerces the type into
    -- numeric when used with numeric operators such as > and >=.
    -- Therefore, we have set up the state to start out as undefined
    -- so that these numeric operators can be used as numeric 
    -- comparators below
  */

  useEffect(() => {
    setActiveSlideIndex(0);
  }, [slides])

  
  // moves the slider `delta` slides forward
  const paginate = (delta) => {    
    setActiveSlideIndex((currentSlide) => (
      // wrap slide increment/decrement around array size
      wrap(0, slides.length, currentSlide + delta)
    ));
  };



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
      



      <div className={styles.svgContainer}>
        <svg
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
          <path
            d="M20 20 H788 V588 H20 z"
            fill="transparent"
            stroke="#f3f3f3"
            strokeWidth="6"
            strokeLinejoin="round"
            strokeLinecap="square"
            initial="blankStroke"
          />
        </svg>
      </div>
    </>
  )
}
