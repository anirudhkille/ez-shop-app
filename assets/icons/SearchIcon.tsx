import Svg, { Circle, Path } from "react-native-svg";

export const SearchIcon = ({ color = "white", size = 24 }) => (
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
    <Path
      d="m21 21-4.34-4.34"
      stroke={color}
      strokeWidth={1.5}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <Circle cx="11" cy="11" r="8" />
  </Svg>
);
