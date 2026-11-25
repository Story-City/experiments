import React from "react";
import { View } from "react-native";
import Svg, { Path } from "react-native-svg";
import { StoryCitySpecificIconProps } from "@/v2/components/StoryCitySvgIcons/SvgIconTypes";

export const ICON_NAME_MAP = "Map" as const;

const Map: React.FC<StoryCitySpecificIconProps> = (props) => {
  return (
    <View>
      <Svg width={props.size} height={props.size} viewBox="0 0 24 24" fill="none">
        <Path
          d="M20.5 3l-.16.03L15 5.1 9 3 3.36 4.9c-.21.07-.36.25-.36.48V20.5c0 .28.22.5.5.5l.16-.03L9 18.9l6 2.1 5.64-1.9c.21-.07.36-.25.36-.48V3.5c0-.28-.22-.5-.5-.5zM10 5.47l4 1.4v11.66l-4-1.4V5.47zm-5 .99l3 1.01v11.7l-3-1.16V6.46zm14 11.08l-3 1.16V7.18l3-1.16v11.52z"
          fill={props.color}
        />
      </Svg>
    </View>
  );
};

export default Map;
