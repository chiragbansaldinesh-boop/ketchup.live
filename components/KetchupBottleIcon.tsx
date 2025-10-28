import React from 'react';
import Svg, { Path } from 'react-native-svg';

interface KetchupBottleIconProps {
  size?: number;
  color?: string;
  fill?: string;
}

export default function KetchupBottleIcon({
  size = 24,
  color = '#000000',
  fill = 'none',
}: KetchupBottleIconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill={fill}>
      <Path
        d="M9 2h6v2h-6V2z"
        stroke={color}
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
        fill={fill}
      />
      <Path
        d="M8 4v2c0 .55.45 1 1 1h6c.55 0 1-.45 1-1V4"
        stroke={color}
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
        fill={fill}
      />
      <Path
        d="M10 7v1.5c0 .83-.67 1.5-1.5 1.5h0c-.83 0-1.5.67-1.5 1.5V22h10V11.5c0-.83-.67-1.5-1.5-1.5h0c-.83 0-1.5-.67-1.5-1.5V7"
        stroke={color}
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
        fill={fill}
      />
      <Path
        d="M7 14h10M7 17h10"
        stroke={color}
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}
