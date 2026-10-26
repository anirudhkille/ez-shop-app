import { IconProps } from "@/types/icon";
import Svg, { Rect, Path } from "react-native-svg";

export const MailIcon = ({ color = "white", size = 24 }: IconProps) => (
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
    <Rect x="2" y="4" width="20" height="16" rx="2" />
    <Path d="m2.5 6.5 9.5 7 9.5-7" />
  </Svg>
);