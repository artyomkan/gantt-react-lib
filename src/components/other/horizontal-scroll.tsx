import React, { SyntheticEvent, useEffect, useRef } from 'react';
import styles from './horizontal-scroll.module.css';

export const HorizontalScroll: React.FC<{
  scroll: number;
  svgWidth: number;
  taskListWidth: number;
  rtl: boolean;
  onScroll: (scrollLeft: number) => void;
}> = ({ scroll, svgWidth, taskListWidth, rtl, onScroll }) => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const isSyncingRef = useRef(false);
  const rafRef = useRef<number | null>(null);

  // Программно обновляем scrollLeft, когда scroll меняется извне
  React.useLayoutEffect(() => {
    const el = scrollRef.current;
    if (!el) return;

    const desiredScrollLeft = rtl ? svgWidth - scroll + taskListWidth : scroll;

    const current = el.scrollLeft;

    // Только если нужно — обновим scrollLeft
    if (Math.abs(current - desiredScrollLeft) > 1) {
      isSyncingRef.current = true;

      el.scrollLeft = desiredScrollLeft + 1; // Принудительное обновление
      el.scrollLeft = desiredScrollLeft;

      // Сбросим флаг в следующем кадре
      rafRef.current = requestAnimationFrame(() => {
        isSyncingRef.current = false;
      });
    }
  }, [scroll, svgWidth, taskListWidth, rtl]);

  // Очистка requestAnimationFrame
  useEffect(() => {
    return () => {
      if (rafRef.current !== null) {
        cancelAnimationFrame(rafRef.current);
      }
    };
  }, []);

  const handleScroll = (event: SyntheticEvent<HTMLDivElement>) => {
    if (isSyncingRef.current) return;

    const el = event.currentTarget;
    const scrollLeft = rtl
      ? svgWidth - el.scrollLeft + taskListWidth
      : el.scrollLeft;

    onScroll(scrollLeft);
  };

  return (
    <div
      dir='ltr'
      style={{
        margin: rtl
          ? `0px ${taskListWidth}px 0px 0px`
          : `0px 0px 0px ${taskListWidth}px`,
      }}
      className={styles.scrollWrapper}
      ref={scrollRef}
      onScroll={handleScroll}
    >
      <div style={{ width: svgWidth }} className={styles.scroll} />
    </div>
  );
};
