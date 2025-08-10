import * as React from 'react';
import Svg, { Path } from 'react-native-svg';

function FavouriteIcon(props: any) {
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
        d="M15.629 3.457a4.124 4.124 0 00-5.835 0l-.795.795-.795-.795a4.126 4.126 0 10-5.835 5.835l.795.795 5.835 5.835 5.835-5.835.795-.795a4.124 4.124 0 000-5.835v0z"
        stroke="#002C69"
        strokeWidth={1.25}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}

export default FavouriteIcon;
