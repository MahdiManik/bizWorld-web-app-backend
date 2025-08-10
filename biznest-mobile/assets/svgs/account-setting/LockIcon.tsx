import * as React from 'react';
import Svg, { Path } from 'react-native-svg';

function LockIcon(props: any) {
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
        d="M16.422 9.448V7.3A4.552 4.552 0 0011.87 2.75 4.55 4.55 0 007.3 7.28v2.168"
        stroke="#002C69"
        strokeWidth={1.5}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path
        clipRule="evenodd"
        d="M15.683 21.25H8.042a3.792 3.792 0 01-3.792-3.793v-4.289a3.792 3.792 0 013.792-3.792h7.641a3.792 3.792 0 013.792 3.793v4.288a3.792 3.792 0 01-3.792 3.793z"
        stroke="#002C69"
        strokeWidth={1.5}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path
        d="M11.863 14.203v2.22"
        stroke="#002C69"
        strokeWidth={1.5}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}

export default LockIcon;
