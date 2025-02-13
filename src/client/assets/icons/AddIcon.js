import React from "react";
import Svg, { Path } from "react-native-svg";

const AddIcon = ({ size = 50, color = "black", style = {} }) => (
  <Svg
    color={color}
    style={style}
    width={size}
    height={size}
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
  >
    <Path
      fill="currentColor"
      d="M12 4c4.411 0 8 3.589 8 8s-3.589 8-8 8s-8-3.589-8-8s3.589-8 8-8m0-2C6.477 2 2 6.477 2 12s4.477 10 10 10s10-4.477 10-10S17.523 2 12 2m5 9h-4V7h-2v4H7v2h4v4h2v-4h4z"
    />
  </Svg>
);

export default AddIcon;
