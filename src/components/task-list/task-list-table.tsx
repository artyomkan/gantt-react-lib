import classNames from 'classnames';
import React from 'react';
import lessImg from '../../assets/less.svg';
import moreImg from '../../assets/more.svg';
import { GanttProps, ITaskExtended } from '../../types/public-types';
import styles from './task-list-table.module.css';

const dateTimeOptions: Intl.DateTimeFormatOptions = {
  year: 'numeric',
  month: '2-digit',
  day: '2-digit',
};

export const TaskListTableDefault: React.FC<{
  rowHeight: number;
  listWidth: string;
  fontFamily: string;
  fontSize: string;
  locale: string;
  tasks: ITaskExtended[];
  selectedTaskId: string;
  setSelectedTask: (taskId: string) => void;
  onExpanderClick: (task: ITaskExtended, isExpanded: boolean) => void;
  renderTaskInfo: GanttProps['renderTaskInfo'];
}> = ({
  rowHeight,
  listWidth,
  tasks,
  fontFamily,
  fontSize,
  locale,
  onExpanderClick,
  renderTaskInfo,
}) => {
  return (
    <div
      className={classNames(styles.wrapper, 'gantt-table-body')}
      style={{
        fontFamily: fontFamily,
        fontSize: fontSize,
      }}
    >
      <table style={{ width: listWidth }}>
        <colgroup>
          <col style={{ width: '60%' }} />
          <col style={{ width: '20%' }} />
          <col style={{ width: '20%' }} />
        </colgroup>
        <thead></thead>
        <tbody className='gantt-table-body'>
          {tasks.map((x) => {
            const expanderSymbol = x.withChildren ? (
              x.isExpanded ? (
                <img src={lessImg} alt='less' />
              ) : (
                <img src={moreImg} alt='more' />
              )
            ) : undefined;

            return (
              <tr key={x.id} style={{ height: rowHeight }}>
                <td style={{ paddingLeft: x.depth * 8 }}>
                  <div
                    className={classNames(
                      styles.nameWrapper,
                      'gantt-table-body-cell-name-wrapper'
                    )}
                    onClick={() =>
                      expanderSymbol
                        ? onExpanderClick(x, x.isExpanded ?? false)
                        : undefined
                    }
                  >
                    <div
                      className={classNames(
                        styles.expander,
                        'gantt-table-body-cell-name__expander'
                      )}
                    >
                      {expanderSymbol}
                    </div>
                    <div
                      className={classNames(
                        styles.name,
                        'gantt-table-body-cell-name'
                      )}
                    >
                      <div
                        className={classNames(
                          styles.text,
                          'gantt-table-body-cell-name_text'
                        )}
                      >
                        {x.name.text}
                      </div>
                      {(renderTaskInfo ?? x.name.renderInfo) && (
                        <div
                          onClick={(event) => {
                            event.stopPropagation();
                          }}
                          className={classNames(
                            styles.info,
                            'gantt-table-body-cell-name_info'
                          )}
                        >
                          {x.name.renderInfo?.(x.id) ?? renderTaskInfo?.(x.id)}
                        </div>
                      )}
                    </div>
                  </div>
                </td>
                <td>{x.start.toLocaleDateString(locale, dateTimeOptions)}</td>
                <td>{x.end.toLocaleDateString(locale, dateTimeOptions)}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};
