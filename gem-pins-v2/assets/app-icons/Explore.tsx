import React from "react";
import { View } from "react-native";
import Svg, { Path } from "react-native-svg";
import { StoryCitySpecificIconProps } from "@/v2/components/StoryCitySvgIcons/SvgIconTypes";

export const ICON_NAME_EXPLORE = "Explore" as const;

const Explore: React.FC<StoryCitySpecificIconProps> = (props) => {
  return (
    <View>
      <Svg
        width={props.size}
        height={props.size}
        viewBox="0 0 24 24"
        fill="none"
      >
        <Path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M10.9444 4C10.9444 2.89543 10.049 2 8.94439 2H4.5C3.39543 2 2.5 2.89543 2.5 4V12.8C2.5 13.9046 3.39543 14.8 4.5 14.8H8.94439C10.049 14.8 10.9444 13.9046 10.9444 12.8V4ZM21.4998 4C21.4998 2.89543 20.6044 2 19.4998 2H15.0555C13.9509 2 13.0555 2.89543 13.0555 4V4.8C13.0555 5.90457 13.9509 6.8 15.0555 6.8H19.4998C20.6044 6.8 21.4998 5.90457 21.4998 4.8V4ZM2.5 19.2C2.5 18.0954 3.39543 17.2 4.5 17.2H8.94439C10.049 17.2 10.9444 18.0954 10.9444 19.2V20C10.9444 21.1046 10.049 22 8.94439 22H4.5C3.39543 22 2.5 21.1046 2.5 20V19.2ZM21.4998 11.2C21.4998 10.0954 20.6044 9.2 19.4998 9.2H15.0555C13.9509 9.2 13.0555 10.0954 13.0555 11.2V20C13.0555 21.1046 13.9509 22 15.0555 22H19.4998C20.6044 22 21.4998 21.1046 21.4998 20V11.2Z"
          stroke={props.color}
          strokeWidth="1.5"
        />
        <Path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M21.5001 4C21.5001 2.89543 20.6046 2 19.5001 2H15.0557C13.9511 2 13.0557 2.89543 13.0557 4V4.8C13.0557 5.90457 13.9511 6.8 15.0557 6.8H19.5001C20.6046 6.8 21.5001 5.90457 21.5001 4.8V4Z"
          stroke={props.secondaryColor}
          strokeWidth="1.5"
        />
      </Svg>
    </View>
  );
}

export default Explore;
