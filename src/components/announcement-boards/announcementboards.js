import React from "react";
import { useState } from "react";
import styles from "./announcementboards.module.scss";
import { motion } from "framer-motion";
import { wrap } from "@popmotion/popcorn";

// subcomponents
import Slide from "./components/slide";


// dummy data
const data = [
  { head: "heading t1", content: "lorem ipsum 1" },
  { head: "heading t2", content: "lorem ipsum 2" },
  { head: "heading t3", content: "lorem ipsum 3" },
  { head: "heading t4", content: "lorem ipsum 4" },
];

// animation states (later all app anims to be abstracted into separate file)
const animationStates = {
  "inactive": {
    
  },
  "active": {

  }
};

export default function AnnouncementBoards() {
  const [activeSlide, setActiveSlide] = useState(0);

  // paginate accepts the direction (sign) and size of jump in
  // active slide number and sets the appropriate slide
  const paginate = (delta) => {
    // wrap slide increment/decrement around array size
    const newSlideIndex = wrap(0, data.length, activeSlide + delta);
    setActiveSlide(newSlideIndex);
  }

  return (
    <>
      <div className={styles.ab_slidescontainer}>        
        <Slide {... data[activeSlide]} />
      </div>

      <button onClick={()=> { paginate(-1) }}>Previous slide</button>
      <button onClick={()=> { paginate(1) } }>Next slide</button>
    </>
  )
}
