import * as React from 'react';
import Svg, { Path } from 'react-native-svg';

function HeartIcon(props: any) {
  return (
    <Svg
      width={24}
      height={24}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <Path
        d="M19.612 5.652a4.735 4.735 0 00-6.7 0L12 6.565l-.913-.913a4.737 4.737 0 00-6.7 6.7l.913.912 6.7 6.7 6.7-6.7.912-.912a4.735 4.735 0 000-6.7v0z"
        stroke="#002C69"
        strokeWidth={1.43519}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}

export default HeartIcon;
