import React, { useMemo } from 'react';
import { ITaskExtended } from '../../types/public-types';
import styles from './task-list-table.module.css';
import classNames from "classnames";

const localeDateStringCache = {};
const toLocaleDateStringFactory =
  (locale: string) =>
  (date: Date, dateTimeOptions: Intl.DateTimeFormatOptions) => {
    const key = date.toString();
    let lds = localeDateStringCache[key];
    if (!lds) {
      lds = date.toLocaleDateString(locale, dateTimeOptions);
      localeDateStringCache[key] = lds;
    }
    return lds;
  };
const dateTimeOptions: Intl.DateTimeFormatOptions = {
  year: 'numeric',
  month: '2-digit',
  day: '2-digit',
};

export const TaskListTableDefault: React.FC<{
  rowHeight: number;
  rowWidth: string;
  fontFamily: string;
  fontSize: string;
  locale: string;
  tasks: ITaskExtended[];
  selectedTaskId: string;
  setSelectedTask: (taskId: string) => void;
  onExpanderClick: (task: ITaskExtended, isExpanded: boolean) => void;
}> = ({
  rowHeight,
  rowWidth,
  tasks,
  fontFamily,
  fontSize,
  locale,
  onExpanderClick,
}) => {
  const toLocaleDateString = useMemo(
    () => toLocaleDateStringFactory(locale),
    [locale]
  );

  return (
    <div
      className={classNames(styles.taskListWrapper, "gantt-table-body")}
      style={{
        fontFamily: fontFamily,
        fontSize: fontSize,
      }}
    >
      {tasks.map((t) => {
        const expanderSymbol = t.withChildren
          ? t.isExpanded
            ? '▼'
            : '▶'
          : undefined;

        return (
          <div
            className={classNames(styles.taskListTableRow, "gantt-table-body-row")}
            style={{ height: rowHeight }}
            key={`${t.id}row`}
          >
            <div
              className={styles.taskListCell}
              style={{
                minWidth: rowWidth,
                maxWidth: rowWidth,
              }}
              title={t.name.text}
            >
              <div className={styles.taskListNameWrapper}>
                <div
                  className={
                      expanderSymbol && t.isExpanded !== undefined
                      ? styles.taskListExpander
                      : styles.taskListEmptyExpander
                  }
                  onClick={() =>
                    expanderSymbol && t.isExpanded !== undefined
                      ? onExpanderClick(t, t.isExpanded)
                      : undefined
                  }
                >
                  {expanderSymbol}
                </div>
                <div
                  onClick={() =>
                    expanderSymbol
                      ? onExpanderClick(t, t.isExpanded ?? false)
                      : undefined
                  }
                >
                  {t.name.render?.(t) ?? t.name.text}
                </div>
              </div>
            </div>
            <div
              className={styles.taskListCell}
              style={{
                minWidth: rowWidth,
                maxWidth: rowWidth,
              }}
            >
              &nbsp;{toLocaleDateString(t.start, dateTimeOptions)}
            </div>
            <div
              className={styles.taskListCell}
              style={{
                minWidth: rowWidth,
                maxWidth: rowWidth,
              }}
            >
              &nbsp;{toLocaleDateString(t.end, dateTimeOptions)}
            </div>
          </div>
        );
      })}
    </div>
  );
};
