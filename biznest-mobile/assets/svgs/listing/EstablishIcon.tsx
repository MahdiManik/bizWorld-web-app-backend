import * as React from 'react';
import Svg, { Path } from 'react-native-svg';

function EstablishIcon(props: any) {
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
        d="M3.094 9.404h17.824M16.441 13.31h.01M12.004 13.31h.01M7.559 13.31h.009M16.441 17.196h.01M12.004 17.196h.01M7.559 17.196h.009M16.043 2v3.29M7.965 2v3.29"
        stroke="#484848"
        strokeWidth={1.5}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path
        clipRule="evenodd"
        d="M16.238 3.58H7.771C4.834 3.58 3 5.214 3 8.221v9.05C3 20.326 4.834 22 7.771 22h8.458C19.175 22 21 20.355 21 17.347V8.222c.01-3.007-1.816-4.643-4.762-4.643z"
        stroke="#484848"
        strokeWidth={1.5}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}

export default EstablishIcon;
