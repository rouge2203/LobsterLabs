import { useState, useEffect, useRef } from "react";
import Navbar from "../Navbar";

const WhiteDiv = () => {
  const [isTopReached, setIsTopReached] = useState(false);
  const whiteDivRef = useRef(null);

  const checkPosition = () => {
    if (whiteDivRef.current) {
      const rect = whiteDivRef.current.getBoundingClientRect();
      setIsTopReached(rect.top <= 100);
    }
  };

  useEffect(() => {
    window.addEventListener("scroll", checkPosition);
    checkPosition(); // Initial check
    return () => window.removeEventListener("scroll", checkPosition);
  }, []);

  return (
    <div
      id="whitediv"
      ref={whiteDivRef}
      className={`sticky  h-screen bg-zinc-200 transition-all duration-300 -mt-10 ${
        isTopReached ? "rounded-none" : "rounded-t-xl"
      } z-20`}
    >
      {isTopReached ? (
        <Navbar
          textColor={"gray-800"}
          hoverTextColor={"white"}
          hoverBgColor={"red-800"}
        />
      ) : null}
      <p>
        Changes: logo a tag... messages a tag dialog... whitediv navbar
        colors... colors overall
      </p>
    </div>
  );
};

export default WhiteDiv;
