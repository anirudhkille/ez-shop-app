import { IconProps } from "@/types/icon";
import Svg, { Path } from "react-native-svg";

export const PlusIcon = ({ color = "white", size = 24 }: IconProps) => (
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
    <Path d="M5 12h14" />
    <Path d="M12 5v14" />
  </Svg>
);
