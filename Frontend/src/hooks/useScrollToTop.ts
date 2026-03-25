// hooks/useScrollToTop.ts
import { useEffect, RefObject } from "react";
import { useLocation } from "react-router-dom";

const useScrollToTop = (scrollRef: RefObject<HTMLElement | null>) => {
  const { pathname, search } = useLocation();

  useEffect(() => {
    if (scrollRef?.current) {
      scrollRef.current.scrollTo({ top: 0, behavior: 'instant' });
    }
  }, [pathname, search]);
};

export default useScrollToTop;