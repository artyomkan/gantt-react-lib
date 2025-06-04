import classNames from 'classnames';
import React from 'react';
import { GanttProps } from '../../types/public-types';
import styles from './task-list-header.module.css';

export const TaskListHeaderDefault: React.FC<{
  headerHeight: number;
  listWidth: string;
  fontFamily: string;
  fontSize: string;
  i18n: GanttProps['i18n'];
}> = ({ headerHeight, fontFamily, fontSize, listWidth, i18n }) => {
  return (
    <div
      className={classNames(styles.wrapper, 'gantt-table-head')}
      style={{
        fontFamily: fontFamily,
        fontSize: fontSize,
      }}
    >
      <table style={{ width: listWidth }}>
        <colgroup>
          <col style={{ width: '50%' }} />
          <col style={{ width: '25%' }} />
          <col style={{ width: '25%' }} />
        </colgroup>
        <thead>
          <tr style={{ height: headerHeight }}>
            <td>{i18n?.table?.columns?.name ?? 'Name'}</td>
            <td>{i18n?.table?.columns?.from ?? 'From'}</td>
            <td>{i18n?.table?.columns?.to ?? 'To'}</td>
          </tr>
        </thead>
        <tbody></tbody>
      </table>
    </div>
  );
};
