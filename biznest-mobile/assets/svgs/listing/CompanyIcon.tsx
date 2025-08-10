import * as React from 'react';
import Svg, { Path } from 'react-native-svg';

function CompanyIcon(props: any) {
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
        d="M11.996 16.677V14.14"
        stroke="#484848"
        strokeWidth={1.5}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path
        clipRule="evenodd"
        d="M18.19 5.33c1.69 0 3.05 1.37 3.05 3.06v3.44c-2.46 1.44-5.71 2.31-9.25 2.31s-6.78-.87-9.24-2.31V8.38c0-1.69 1.37-3.05 3.06-3.05h12.38z"
        stroke="#484848"
        strokeWidth={1.5}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path
        d="M15.496 5.326V4.96c0-1.22-.99-2.21-2.21-2.21h-2.58c-1.22 0-2.21.99-2.21 2.21v.366M2.773 15.483l.19 2.51a3.242 3.242 0 003.231 2.997h11.6a3.242 3.242 0 003.231-2.998l.19-2.509"
        stroke="#484848"
        strokeWidth={1.5}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}

export default CompanyIcon;
