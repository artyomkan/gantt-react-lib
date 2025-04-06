import React from 'react';

export const useHorizontalScrollSync = () => {
  const [scrollX, setScrollX] = React.useState(0);
  const scrollRef = React.useRef<HTMLDivElement>(null);
  const ticking = React.useRef(false);

  const onScroll = React.useCallback(
    (event: React.SyntheticEvent<HTMLDivElement>) => {
      const newScrollLeft = event.currentTarget.scrollLeft;

      if (!ticking.current) {
        window.requestAnimationFrame(() => {
          setScrollX(newScrollLeft);
          ticking.current = false;
        });

        ticking.current = true;
      }
    },
    []
  );

  React.useEffect(() => {
    if (scrollRef.current && scrollRef.current.scrollLeft !== scrollX) {
      scrollRef.current.scrollLeft = scrollX;
    }
  }, [scrollX]);

  return {
    setScrollX,
    scrollX,
    onScroll,
    scrollRef,
  };
};
