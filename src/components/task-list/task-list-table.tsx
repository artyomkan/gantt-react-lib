import classNames from 'classnames';
import React from 'react';
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
  const lessImg =
    'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTIiIGhlaWdodD0iMTIiIHZpZXdCb3g9IjAgMCAxMiAxMiIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHBhdGggZmlsbC1ydWxlPSJldmVub2RkIiBjbGlwLXJ1bGU9ImV2ZW5vZGQiIGQ9Ik05Ljg2NDMgNy40MTQwMkMxMC4wNTk2IDcuNjA5MjkgMTAuMDU5NiA3LjkyNTg3IDkuODY0MyA4LjEyMTEzQzkuNjY5MDMgOC4zMTYzOSA5LjM1MjQ1IDguMzE2MzkgOS4xNTcxOSA4LjEyMTEzTDUuOTc1MjEgNC45MzkxNUwyLjc5MzIzIDguMTIxMTNDMi41OTc5NyA4LjMxNjM5IDIuMjgxMzggOC4zMTYzOSAyLjA4NjEyIDguMTIxMTNDMS44OTA4NiA3LjkyNTg3IDEuODkwODYgNy42MDkyOSAyLjA4NjEyIDcuNDE0MDJMNS42MjA4MyAzLjg3OTMyQzUuNjIxMSAzLjg3OTA0IDUuNjIxMzggMy44Nzg3NyA1LjYyMTY2IDMuODc4NDlDNS44MTY5MiAzLjY4MzIzIDYuMTMzNSAzLjY4MzIzIDYuMzI4NzYgMy44Nzg0OUw5Ljg2NDMgNy40MTQwMloiIGZpbGw9IiM0NzRFNTMiLz4KPC9zdmc+Cg==';
  const moreImg =
    'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTIiIGhlaWdodD0iMTIiIHZpZXdCb3g9IjAgMCAxMiAxMiIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHBhdGggZmlsbC1ydWxlPSJldmVub2RkIiBjbGlwLXJ1bGU9ImV2ZW5vZGQiIGQ9Ik0yLjA4NTkgNC41ODU5OEMxLjg5MDY0IDQuMzkwNzEgMS44OTA2NCA0LjA3NDEzIDIuMDg1OSAzLjg3ODg3QzIuMjgxMTYgMy42ODM2MSAyLjU5Nzc0IDMuNjgzNjEgMi43OTMwMSAzLjg3ODg3TDUuOTc0OTkgNy4wNjA4NUw5LjE1Njk3IDMuODc4ODdDOS4zNTIyMyAzLjY4MzYxIDkuNjY4ODEgMy42ODM2MSA5Ljg2NDA3IDMuODc4ODdDMTAuMDU5MyA0LjA3NDEzIDEwLjA1OTMgNC4zOTA3MSA5Ljg2NDA3IDQuNTg1OThMNi4zMjg1NCA4LjEyMTUxQzYuMTMzMjggOC4zMTY3NyA1LjgxNjcgOC4zMTY3NyA1LjYyMTQzIDguMTIxNTFMMi4wODU5IDQuNTg1OThaIiBmaWxsPSIjNDc0RTUzIi8+Cjwvc3ZnPgo=';

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
