import React from "react";
import Svg, { Path } from "react-native-svg";

export const ChevronLeftIcon = ({ color = "white", size = 24 }) => (
  <Svg
    height={size}
    width={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke={color}
    strokeWidth={1.5}
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <Path d="m15 18-6-6 6-6" />
  </Svg>
);
