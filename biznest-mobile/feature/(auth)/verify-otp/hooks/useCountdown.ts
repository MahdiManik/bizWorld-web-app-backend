import { useEffect, useState } from 'react';

export default function useCountdown(second: number): {
  secondLeft: number;
  restart: (seconds: number) => void;
  formattedTime: string;
} {
  const [secondLeft, setSecondLeft] = useState(second);
  useEffect(() => {
    if (secondLeft <= 0) return;
    const timeout = setTimeout(() => {
      setSecondLeft(secondLeft - 1);
    }, 1000);
    return () => clearTimeout(timeout);
  }, [secondLeft]);
  function restart(seconds: number) {
    setSecondLeft(seconds);
  }

  const minutes = Math.floor(secondLeft / 60);
  const seconds = secondLeft % 60;

  const formattedMinutes = String(minutes).padStart(2, '0');
  const formattedSeconds = String(seconds).padStart(2, '0');
  return {
    secondLeft,
    restart,
    formattedTime: `${formattedMinutes}:${formattedSeconds}`,
  };
}
