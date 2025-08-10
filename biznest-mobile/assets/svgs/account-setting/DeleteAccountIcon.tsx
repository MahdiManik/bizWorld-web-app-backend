import * as React from 'react';
import Svg, { G, Path, Defs, ClipPath } from 'react-native-svg';

function DeleteAccountIcon(props: any) {
  return (
    <Svg
      width={60}
      height={60}
      viewBox="0 0 60 60"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <G clipPath="url(#clip0_5350_13795)">
        <Path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M14.783 0h30.431c7.86 0 14.29 6.432 14.29 14.291v31.418c0 7.86-6.43 14.29-14.29 14.29H14.783C6.923 60 .493 53.57.493 45.71V14.291c0-7.86 6.43-14.29 14.29-14.29z"
          fill="#FFD7D7"
        />
        <G clipPath="url(#clip1_5350_13795)">
          <Path
            d="M30.002 46.15c8.919 0 16.15-7.23 16.15-16.15 0-8.92-7.231-16.15-16.15-16.15-8.92 0-16.15 7.23-16.15 16.15 0 8.92 7.23 16.15 16.15 16.15z"
            fill="#EE3624"
          />
          <Path
            d="M37.648 33.509L34.14 30l3.51-3.509a1.334 1.334 0 000-1.886l-2.252-2.251a1.334 1.334 0 00-1.886 0L30 25.863l-3.508-3.51a1.334 1.334 0 00-1.886 0l-2.251 2.252a1.334 1.334 0 000 1.886l3.508 3.51-3.508 3.508a1.334 1.334 0 000 1.886l2.25 2.251a1.334 1.334 0 001.887 0l3.509-3.508 3.509 3.508a1.334 1.334 0 001.886 0l2.251-2.25a1.334 1.334 0 000-1.887z"
            fill="#fff"
          />
          <Path
            opacity={0.1}
            d="M46.15 30c0 8.918-7.232 16.15-16.15 16.15v-32.3c8.918 0 16.15 7.232 16.15 16.15z"
            fill="#000"
          />
        </G>
      </G>
      <Defs>
        <ClipPath id="clip0_5350_13795">
          <Path fill="#fff" d="M0 0H60V60H0z" />
        </ClipPath>
        <ClipPath id="clip1_5350_13795">
          <Path fill="#fff" transform="translate(13 13)" d="M0 0H34V34H0z" />
        </ClipPath>
      </Defs>
    </Svg>
  );
}

export default DeleteAccountIcon;
