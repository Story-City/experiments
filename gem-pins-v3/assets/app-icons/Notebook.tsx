import React from "react";
import { View } from "react-native";
import Svg, { Path, Rect } from "react-native-svg";
import { StoryCitySpecificIconProps } from "@/v2/components/StoryCitySvgIcons/SvgIconTypes";

export const ICON_NAME_NOTEBOOK = "Notebook" as const;

const Notebook: React.FC<StoryCitySpecificIconProps> = (props) => {
  return (
    <View>
      <Svg
        width={props.size}
        height={props.size}
        viewBox="0 0 24 24"
        fill="none"
      >
        <Rect
          x="6"
          y="4"
          width="13"
          height="17"
          rx="2"
          stroke={props.color}
          strokeWidth="2"
        />
        <Path
          d="M15 10V8"
          stroke={props.secondaryColor}
          strokeWidth="2"
          strokeLinecap="round"
        />
        <Path
          d="M4 9H8"
          stroke={props.secondaryColor}
          strokeWidth="2"
          strokeLinecap="round"
        />
        <Path
          d="M4 13H8"
          stroke={props.secondaryColor}
          strokeWidth="2"
          strokeLinecap="round"
        />
        <Path
          d="M4 17H8"
          stroke={props.secondaryColor}
          strokeWidth="2"
          strokeLinecap="round"
        />
      </Svg>
    </View>
  );
}

export default Notebook;