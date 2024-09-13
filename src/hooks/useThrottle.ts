import { useCallback, useEffect, useRef } from "react";

export function useThrottle() {
  // 마지막으로 함수가 실행된 시간을 지정하는 ref
  // ref를 사용하여 리랜더링 간에 값을 유지
  const lastRun = useRef<number>(Date.now());
  // 현재 대기 중인 타이머를 추적하는 ref
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  // 컴포넌트 언마운트 시 타이머 정리 -> 메모리 누수 방지
  useEffect(() => {
    return () => {
      // 대기 중인 타이머가 있을 경우 취소
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  // 쓰로틀된 함수를 반환하는 useCallback
  return useCallback((callback: () => Promise<void>, delay: number) => {
    // 실제로 콜백을 실행하고 lastRun을 업데이트하는 함수
    const execute = () => {
      callback();
      lastRun.current = Date.now();
    };

    // 마지막 실행 이후 경과된 시간 계산
    const timeElapsed = Date.now() - lastRun.current;

    // 경과 시간이 지연 시간보다 크거나 같으면 즉시 실행
    if (timeElapsed >= delay) {
      execute();
    } else {
      // 경과 시간이 지연 시간보다 작으면 남은 시간만큼 대기 후 실행
      // 이전에 예약된 타이머가 있다면 취소
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      // 새로운 타이머 설정
      timeoutRef.current = setTimeout(() => {
        execute();
      }, delay - timeElapsed);
    }
  }, []);
}
