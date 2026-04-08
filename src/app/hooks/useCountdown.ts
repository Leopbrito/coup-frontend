import { useState, useEffect, useRef } from 'react';

interface UseCountdownOptions {
  duration: number;
  onComplete?: () => void;
  autoStart?: boolean;
}

export function useCountdown({ duration, onComplete, autoStart = true }: UseCountdownOptions) {
  const [timeLeft, setTimeLeft] = useState(duration);
  const [isRunning, setIsRunning] = useState(autoStart);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (!isRunning) return;

    setTimeLeft(duration);

    intervalRef.current = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          if (intervalRef.current) {
            clearInterval(intervalRef.current);
          }
          setIsRunning(false);
          onComplete?.();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isRunning, duration, onComplete]);

  const start = () => {
    setTimeLeft(duration);
    setIsRunning(true);
  };

  const pause = () => {
    setIsRunning(false);
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
  };

  const reset = () => {
    setTimeLeft(duration);
    setIsRunning(false);
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
  };

  return {
    timeLeft,
    isRunning,
    start,
    pause,
    reset,
    progress: ((duration - timeLeft) / duration) * 100,
  };
}
