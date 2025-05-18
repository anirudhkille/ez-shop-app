import React from "react";
import Svg, { Circle, Path } from "react-native-svg";

export const CircleXIcon = ({ color = "white", size = 24 }) => (
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
    <Circle cx={12} cy={12} r={10} />
    <Path d="m15 9-6 6" />
    <Path d="m9 9 6 6" />
  </Svg>
);
