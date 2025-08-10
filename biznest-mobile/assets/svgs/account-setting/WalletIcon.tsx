import * as React from 'react';
import Svg, { Path, Mask, G } from 'react-native-svg';

function WalletIcon(props: any) {
  return (
    <Svg
      width={21}
      height={20}
      viewBox="0 0 21 20"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <Path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M19.888 12.896H15.84a3.446 3.446 0 01-3.442-3.44 3.447 3.447 0 013.442-3.442h4.048a.75.75 0 010 1.5H15.84a1.945 1.945 0 00-1.942 1.942c0 1.069.872 1.94 1.942 1.94h4.048a.75.75 0 010 1.5z"
        fill="#002C69"
      />
      <Path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M16.296 10.144h-.312a.75.75 0 010-1.5h.312a.75.75 0 010 1.5z"
        fill="#002C69"
      />
      <Mask
        id="a"
        style={{
          maskType: 'luminance',
        }}
        maskUnits="userSpaceOnUse"
        x={0}
        y={0}
        width={21}
        height={20}
      >
        <Path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M0 0h20.639v19.173H0V0z"
          fill="#fff"
        />
      </Mask>
      <G mask="url(#a)">
        <Path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M5.998 1.5A4.503 4.503 0 001.5 5.998v7.177a4.503 4.503 0 004.498 4.498h8.644a4.503 4.503 0 004.497-4.498V5.998A4.503 4.503 0 0014.642 1.5H5.998zm8.644 17.673H5.998A6.005 6.005 0 010 13.175V5.998A6.005 6.005 0 015.998 0h8.644a6.004 6.004 0 015.997 5.998v7.177a6.004 6.004 0 01-5.997 5.998z"
          fill="#002C69"
        />
      </G>
      <Path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M10.684 6.038H5.285a.75.75 0 010-1.5h5.4a.75.75 0 010 1.5z"
        fill="#002C69"
      />
    </Svg>
  );
}

export default WalletIcon;
