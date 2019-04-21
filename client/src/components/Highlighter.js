import React from "react";

const Highlighter = ({ highlight, text }) => {
  // Split on higlight term and include term into parts, ignore case
  const parts = text.split(new RegExp(`(${highlight})`, "gi"));
  return (
    <span>
      {" "}
      {parts.map((part, i) => (
        <span
          key={i}
          style={
            part.toLowerCase() === highlight.toLowerCase()
              ? { fontWeight: "bold" }
              : {}
          }
        >
          {part}
        </span>
      ))}
{" "}
    </span>
  );
};

export default Highlighter;
