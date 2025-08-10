import * as React from 'react';
import Svg, { Path } from 'react-native-svg';

function DeleteIcon(props: any) {
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
        d="M19.324 9.468s-.543 6.735-.858 9.572c-.15 1.355-.987 2.149-2.358 2.174-2.61.047-5.221.05-7.83-.005-1.318-.027-2.141-.831-2.288-2.162-.317-2.862-.857-9.58-.857-9.58M20.708 6.24H3.75M17.439 6.24a1.648 1.648 0 01-1.615-1.325L15.58 3.7a1.28 1.28 0 00-1.237-.949H10.11a1.28 1.28 0 00-1.237.95L8.63 4.914A1.648 1.648 0 017.016 6.24"
        stroke="#CC0001"
        strokeWidth={1.5}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}

export default DeleteIcon;
