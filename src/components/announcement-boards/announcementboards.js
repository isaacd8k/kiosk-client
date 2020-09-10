import React from "react";
import styles from "./announcementboards.module.scss";

// subcomponents
import Slide from "./components/slide";

export default function AnnouncementBoards() {
  // slide duration (later pulled in from config)
  const slideDuration = 30;

  // set up timer & cleanup fn


  // fn startSlides

  // fn pauseSlides

  // fn resumeSlides

  // fn resetSlides

  return (
    <>
      <div className={styles.ab_slidescontainer}>        
        <Slide />
        <Slide />
        <Slide />
        <Slide />
      </div>
    </>
  )
}
