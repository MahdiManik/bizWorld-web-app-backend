import * as React from 'react';
import Svg, { Path } from 'react-native-svg';

interface NotiIconProps {
  isBlue?: boolean;
}
function NotiIcon({ isBlue = false, ...props }: NotiIconProps) {
  return (
    <Svg width={20} height={22} viewBox="0 0 20 22" fill="none" {...props}>
      <Path
        d="M19.241 15.92a2.802 2.802 0 01-2.78 2.58H3.541a2.783 2.783 0 01-1.85-4.87l.38-.34a2.81 2.81 0 00.91-1.63l.79-4.75a6.325 6.325 0 016.25-5.29c.15 0 .31.01.46.02a4.258 4.258 0 00-.48 1.98A4.38 4.38 0 0014.381 8a4.217 4.217 0 001.99-.49l.68 4.11c.109.65.442 1.24.94 1.67l.29.24a2.792 2.792 0 01.96 2.39zM13.442 19.5a3.755 3.755 0 01-6.88 0h6.88z"
        fill={isBlue ? '#002C69' : '#ffffff'}
      />
      <Path
        d="M14.375 7a3.375 3.375 0 100-6.75 3.375 3.375 0 000 6.75z"
        fill={isBlue ? '#002C69' : '#ffffff'}
      />
    </Svg>
  );
}

export default NotiIcon;
