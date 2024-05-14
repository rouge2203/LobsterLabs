import React, { useState, useEffect, useRef } from "react";

const StickyDivs = () => {
  const [topReached, setTopReached] = useState([]);
  const divRefs = useRef([]);

  const checkTopReach = () => {
    const newTopReached = divRefs.current.map((div) => {
      if (div) {
        const rect = div.getBoundingClientRect();
        // Check if the top of the div is at or above the top of the viewport
        return rect.top <= 0;
      }
      return false;
    });
    setTopReached(newTopReached);
  };

  useEffect(() => {
    window.addEventListener("scroll", checkTopReach);
    checkTopReach(); // Initial check
    return () => window.removeEventListener("scroll", checkTopReach);
  }, []);

  const colors = [
    { from: "green-200", to: "blue-200" },
    { from: "indigo-800", to: "purple-800" },
    { from: "purple-800", to: "pink-800" },
    { from: "blue-200", to: "indigo-100" },
  ];

  return (
    <div className="relative">
      {colors.map((color, index) => (
        <div
          key={index}
          ref={(el) => (divRefs.current[index] = el)}
          className={`sticky  h-screen flex flex-col -mt-32 items-center justify-center bg-gradient-to-b from-${
            color.from
          } to-${color.to} ${
            topReached[index] ? "rounded-none" : "rounded-t-xl"
          } transition-all duration-300`}
        >
          <h2 className="text-4xl font-bold">The Slide {index + 1}</h2>
          <p className="mt-2">Scroll to see the effect</p>
        </div>
      ))}
    </div>
  );
};

export default StickyDivs;
