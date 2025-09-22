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
  fill = 'none' 
}: KetchupBottleIconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill={fill}>
      {/* Bottle cap - wider and more rounded */}
      <Path
        d="M8 2h8c1 0 1 0.5 1 1v1c0 0.5 0 1-1 1H8c-1 0-1-0.5-1-1V3c0-0.5 0-1 1-1z"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill={fill}
      />
      
      {/* Bottle neck - narrower transition */}
      <Path
        d="M10 5v1.5c0 0.3 0.2 0.5 0.5 0.5h3c0.3 0 0.5-0.2 0.5-0.5V5"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill={fill}
      />
      
      {/* Main bottle body - classic ketchup bottle shape */}
      <Path
        d="M10.5 7C9.5 7 8.5 7.5 8 8.5v10.5c0 1.1 0.9 2 2 2h4c1.1 0 2-0.9 2-2V8.5C15.5 7.5 14.5 7 13.5 7h-3z"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill={fill}
      />
      
      {/* Ketchup drip inside bottle */}
      <Path
        d="M12 9c-1 0-2 1-2 2v6c0 1 1 2 2 2s2-1 2-2v-6c0-1-1-2-2-2z M11 11c0.5-0.5 1-0.5 1.5 0"
        stroke={fill === 'none' ? color : 'none'}
        strokeWidth="1"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill={fill === 'none' ? 'none' : color}
        opacity="0.7"
      />
    </Svg>
  );
}