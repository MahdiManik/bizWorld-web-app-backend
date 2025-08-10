import * as React from 'react';
import Svg, { Path } from 'react-native-svg';

function BurgerIcon(props: any) {
  return (
    <Svg
      width={18}
      height={18}
      viewBox="0 0 18 18"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <Path
        d="M2.25 4.5h13.5M2.25 9h13.5M2.25 13.5h13.5"
        stroke="#999"
        strokeWidth={1.5}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}

export default BurgerIcon;
