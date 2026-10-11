import { IconProps } from "@/types/icon";
import Svg, { Rect, Path } from "react-native-svg";

export const LockIcon = ({ color = "white", size = 24 }: IconProps) => (
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
    <Rect x="4" y="10" width="16" height="11" rx="2" />
    <Path d="M8 10V7a4 4 0 0 1 8 0v3" />
  </Svg>
);