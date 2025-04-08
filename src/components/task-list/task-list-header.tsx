import React from 'react';
import styles from './task-list-header.module.css';
import classNames from "classnames";

export const TaskListHeaderDefault: React.FC<{
    headerHeight: number;
    listWidth: string;
    fontFamily: string;
    fontSize: string;
}> = ({headerHeight, fontFamily, fontSize, listWidth}) => {
    return (
        <div
            className={classNames(styles.wrapper, "gantt-table-head")}
            style={{
                fontFamily: fontFamily,
                fontSize: fontSize
            }}
        >
            <table style={{width: listWidth}}>
                <colgroup>
                    <col style={{width: "60%"}}/>
                    <col style={{width: "20%"}}/>
                    <col style={{width: "20%"}}/>
                </colgroup>
                <thead>
                <tr style={{height: headerHeight}}>
                    <td>
                        Name
                    </td>
                    <td>
                        From
                    </td>
                    <td>
                        To
                    </td>
                </tr>
                </thead>
                <tbody></tbody>
            </table>
        </div>
    );
};
