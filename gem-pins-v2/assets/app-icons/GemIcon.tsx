import React from 'react';
import Svg, { Path } from 'react-native-svg';

import { palette } from '@/v2/config/defaultTheme';
import { MAP_MODE_COLORS } from '@/v2/routes/ScriptedFtue/ScriptedFtueConstants';

const GEM_VIEW_WIDTH = 24;
const GEM_VIEW_HEIGHT = 22;
const GEM_VIEW_BOX = `0 0 ${GEM_VIEW_WIDTH} ${GEM_VIEW_HEIGHT}`;
const GEM_STROKE_WIDTH = 1.5;
const GEM_FACET_STROKE_WIDTH = 1;
const GEM_OUTLINE_PATH = 'M7 1.5H17L22.5 7.5L12 20.5L1.5 7.5Z';
const GEM_TABLE_PATH = 'M7 1.5H17L15 7.5H9Z';
const GEM_SHADE_PATH = 'M15 7.5H22.5L12 20.5Z';
const GEM_FACETS_PATH = 'M1.5 7.5H22.5M7 1.5L9 7.5L12 20.5L15 7.5L17 1.5';
const GEM_HIGHLIGHT_OPACITY = 0.3;
const GEM_SHADE_OPACITY = 0.22;
const GEM_FACET_OPACITY = 0.6;

interface GemIconProps {
  size?: number;
}

const GemIcon: React.FC<GemIconProps> = (props) => {
  const width = props.size ?? GEM_VIEW_WIDTH;
  const height = (width * GEM_VIEW_HEIGHT) / GEM_VIEW_WIDTH;
  return (
    <Svg width={width} height={height} viewBox={GEM_VIEW_BOX}>
      <Path d={GEM_OUTLINE_PATH} fill={MAP_MODE_COLORS.hunt} />
      <Path d={GEM_TABLE_PATH} fill={palette.white} fillOpacity={GEM_HIGHLIGHT_OPACITY} />
      <Path d={GEM_SHADE_PATH} fill={palette.black} fillOpacity={GEM_SHADE_OPACITY} />
      <Path d={GEM_FACETS_PATH} fill="none" stroke={palette.white} strokeOpacity={GEM_FACET_OPACITY} strokeWidth={GEM_FACET_STROKE_WIDTH} strokeLinejoin="round" />
      <Path d={GEM_OUTLINE_PATH} fill="none" stroke={palette.white} strokeWidth={GEM_STROKE_WIDTH} strokeLinejoin="round" />
    </Svg>
  );
};

export default GemIcon;
