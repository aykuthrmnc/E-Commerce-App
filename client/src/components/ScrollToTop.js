import classNames from "classnames";
import React, { useEffect, useState } from "react";

const ScrollToTop = () => {
  const [scrollTop, setScrollTop] = useState(false);

  useEffect(() => {
    window.addEventListener("scroll", () => {
      if (window.scrollY > 50) {
        setScrollTop(true);
      } else {
        setScrollTop(false);
      }
    });
  }, []);

  return (
    <div
      type="button"
      onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
      className={classNames({
        "scroll-top": true,
        "d-none": !scrollTop,
      })}
    >
      <i className="lni lni-chevron-up" />
      {/* <FaChevronUp /> */}
    </div>
  );
};

export default ScrollToTop;
