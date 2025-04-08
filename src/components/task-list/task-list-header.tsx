import React from 'react';
import styles from './task-list-header.module.css';
import classNames from "classnames";

export const TaskListHeaderDefault: React.FC<{
  headerHeight: number;
  rowWidth: string;
  fontFamily: string;
  fontSize: string;
}> = ({ headerHeight, fontFamily, fontSize, rowWidth }) => {
  return (
    <div
      className={styles.ganttTable}
      style={{
        fontFamily: fontFamily,
        fontSize: fontSize,
      }}
    >
      <div
        className={classNames(styles.ganttTable_Header, "gantt-table-header")}
        style={{
          height: headerHeight - 2,
        }}
      >
        <div
          className={classNames(styles.ganttTable_HeaderItem, "gantt-table-header-item")}
          style={{
            minWidth: rowWidth,
          }}
        >
          &nbsp;Name
        </div>
        <div
          className={classNames(styles.ganttTable_HeaderSeparator, "gantt-table-header-separator")}
          style={{
            height: headerHeight * 0.5,
            marginTop: headerHeight * 0.2,
          }}
        />
        <div
            className={classNames(styles.ganttTable_HeaderItem, "gantt-table-header-item")}
          style={{
            minWidth: rowWidth,
          }}
        >
          &nbsp;From
        </div>
        <div
            className={classNames(styles.ganttTable_HeaderSeparator, "gantt-table-header-separator")}
          style={{
            height: headerHeight * 0.5,
            marginTop: headerHeight * 0.25,
          }}
        />
        <div
            className={classNames(styles.ganttTable_HeaderItem, "gantt-table-header-item")}
          style={{
            minWidth: rowWidth,
          }}
        >
          &nbsp;To
        </div>
      </div>
    </div>
  );
};
