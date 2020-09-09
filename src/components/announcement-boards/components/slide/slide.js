import React from "react";
import styles from "./slide.module.scss";

export default function Slide() {
  return (
    <div className={styles.ab_slide}>
      <header>
        {/* Insert SVG icon placeholder here */}
        <span className={styles.ab_title}>(Interpolated title)</span>
      </header>

      <div className={styles.ab_content}>
        Lorem ipsum dolor sit amet consectetur adipisicing elit. Ducimus dicta eveniet neque dolores eius explicabo doloremque libero delectus nisi magni. Ex delectus molestias, laborum officia facere laudantium ullam architecto sint!
      </div>
    </div>
  )
}
