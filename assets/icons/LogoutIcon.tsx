import Svg, { Path } from "react-native-svg";

export const LogoutIcon = ({ color = "white", size = 24 }) => (
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
    <Path d="m16 17 5-5-5-5" />
    <Path d="M21 12H9" />
    <Path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
  </Svg>
);
