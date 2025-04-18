import { Svg, Path, G } from "react-native-svg";

const LaundryIcon = ({ style = {}, size = 50, colour = "black" }) => {
  return (
    <Svg
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      color={colour}
      style={style}
      viewBox="0 0 14 14"
    >
      <G
        fill="none"
        stroke="currentColor"
        stroke-linecap="round"
        stroke-linejoin="round"
        stroke-width="1"
      >
        <Path d="M11.5.5h-9a1 1 0 0 0-1 1v11a1 1 0 0 0 1 1h9a1 1 0 0 0 1-1v-11a1 1 0 0 0-1-1" />
        <Path d="M9.959 9h-.841C8.383 9 7.658 8.829 7 8.5v0A4.7 4.7 0 0 0 4.882 8h-.84M10 8.5a3 3 0 1 1-6 0a3 3 0 0 1 6 0m-8.5-5h11" />
      </G>
    </Svg>
  );
};

export default LaundryIcon;
