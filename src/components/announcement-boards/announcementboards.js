import React from "react";
import styles from "./announcementboards.module.scss";

// subcomponents
import Slide from "./components/slide";

export default function AnnouncementBoards() {

    // timer - play, pause, resume, reset
    // slides data [title, content]

  return (
    <>
      <div className={styles.ab_slidescontainer}>
        
        <Slide />

      </div>
    </>
  )
}
