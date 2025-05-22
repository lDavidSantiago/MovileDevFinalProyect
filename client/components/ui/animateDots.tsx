import React, { useState, useEffect } from "react";
import { ThemedText } from "../ThemedText";

const LoadingTextAnimation = () => {
  const [dots, setDots] = useState("");

  useEffect(() => {
    const intervalId = setInterval(() => {
      setDots((prevDots) => {
        if (prevDots.length < 3) {
          return prevDots + ".";
        } else {
          return "";
        }
      });
    }, 1000); // Adjust the interval for faster/slower animation

    return () => clearInterval(intervalId); // Clean up the interval on unmount
  }, []);

  return <ThemedText style={{ color: "gray" }}>Loading{dots}</ThemedText>;
};

export default LoadingTextAnimation;
