import * as React from 'react';
import Svg, { Path } from 'react-native-svg';

function ProfileIcon(props: any) {
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
        clipRule="evenodd"
        d="M11.983 15.346c-3.868 0-7.17.585-7.17 2.927s3.281 2.948 7.17 2.948c3.868 0 7.17-.586 7.17-2.927s-3.281-2.948-7.17-2.948z"
        stroke="#002C69"
        strokeWidth={1.5}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path
        clipRule="evenodd"
        d="M11.983 12.006A4.596 4.596 0 107.387 7.41a4.58 4.58 0 004.564 4.596h.032z"
        stroke="#002C69"
        strokeWidth={1.42857}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}

export default ProfileIcon;
