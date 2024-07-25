import React from "react";
import { Link } from "react-router-dom";

/**
 *
 * this file is a temporary solution for bug
 * bug: pdf doesnt load on initial state,but loads if page is reloaded or rerendered(react-pdf-viewer-lib)
 *
 * -yogen
 */

const CustomLink = ({ to, children }) => {
  const handleClick = (event) => {
    if (to.startsWith("/app/viewPdf")) {
      event.preventDefault();
      window.location.href = to;
    }
  };

  return (
    <Link to={to} onClick={handleClick}>
      {children}
    </Link>
  );
};

export default CustomLink;
