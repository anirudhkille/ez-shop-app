import { IconProps } from "@/types/icon";
import Svg, { Path, Line } from "react-native-svg";

export const TuneIcon = ({ color = "white", size = 24 }: IconProps) => (
  <Svg
    height={size}
    width={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke={color}
    strokeWidth={1.6}
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <Line x1="4" y1="7" x2="20" y2="7" />
    <Line x1="4" y1="17" x2="20" y2="17" />
    <Path d="M9 4v6" />
    <Path d="M15 14v6" />
  </Svg>
);