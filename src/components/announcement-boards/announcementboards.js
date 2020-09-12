import React from "react";
import { useState } from "react";
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
    </>
  )
}
