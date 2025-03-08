import { Svg, Path } from "react-native-svg";

const CancelIcon = ({ size = 50, style = {} }) => {
  return (
    <Svg
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      style={style}
      viewBox="0 0 512 512"
      color={"black"}
    >
      <Path
        fill="currentColor"
        fill-rule="evenodd"
        d="M420.48 121.813L390.187 91.52L256 225.92L121.813 91.52L91.52 121.813L225.92 256L91.52 390.187l30.293 30.293L256 286.08l134.187 134.4l30.293-30.293L286.08 256z"
      />
    </Svg>
  );
};

export default CancelIcon;
