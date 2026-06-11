import { useEffect, type RefObject } from 'react';

interface UseLoadMoreOnIntersectParams {
  enabled: boolean;
  isLoading: boolean;
  onLoadMore: () => void;
  root?: Element | null;
  rootMargin?: string;
  targetRef: RefObject<Element | null>;
}

export function useLoadMoreOnIntersect({
  enabled,
  isLoading,
  onLoadMore,
  root = null,
  rootMargin = '120px',
  targetRef,
}: UseLoadMoreOnIntersectParams): void {
  useEffect(() => {
    const target = targetRef.current;
    if (!target || !enabled) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !isLoading) {
          onLoadMore();
        }
      },
      { root, rootMargin },
    );

    observer.observe(target);

    return () => {
      observer.disconnect();
    };
  }, [enabled, isLoading, onLoadMore, root, rootMargin, targetRef]);
}
