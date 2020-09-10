import React from "react";
import styles from "./slide.module.scss";

export default function Slide({head, content}) {
  return (
    <div className={styles.ab_slide}>
      <header>
        {/* Insert SVG icon placeholder here */}
        <span className={styles.ab_title}>{head}</span>
      </header>

      <div className={styles.ab_content}>
        {content}
      </div>
    </div>
  )
}
