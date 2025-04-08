import React, {useEffect, useRef} from 'react';
import {BarTask} from '../../types/bar-task';
import {ITaskExtended} from '../../types/public-types';
import {TaskListHeaderDefault} from './task-list-header';
import {TaskListTableDefault} from './task-list-table';

export type TaskListProps = {
    headerHeight: number;
    listWidth: string;
    fontFamily: string;
    fontSize: string;
    rowHeight: number;
    ganttHeight: number;
    scrollY: number;
    locale: string;
    tasks: ITaskExtended[];
    taskListRef: React.RefObject<HTMLDivElement>;
    horizontalContainerClass?: string;
    selectedTask: BarTask | undefined;
    setSelectedTask: (task: string) => void;
    onExpanderClick: (task: ITaskExtended, isExpanded: boolean) => void;
};

export const TaskList: React.FC<TaskListProps> = ({
                                                      headerHeight,
                                                      fontFamily,
                                                      fontSize,
                                                      listWidth,
                                                      rowHeight,
                                                      scrollY,
                                                      tasks,
                                                      selectedTask,
                                                      setSelectedTask,
                                                      onExpanderClick,
                                                      locale,
                                                      ganttHeight,
                                                      taskListRef,
                                                      horizontalContainerClass
                                                  }) => {
    const horizontalContainerRef = useRef<HTMLDivElement>(null);
    useEffect(() => {
        if (horizontalContainerRef.current) {
            horizontalContainerRef.current.scrollTop = scrollY;
        }
    }, [scrollY]);

    const headerProps = {
        headerHeight,
        fontFamily,
        fontSize,
        listWidth,
    };
    const selectedTaskId = selectedTask ? selectedTask.id : '';
    const tableProps = {
        rowHeight,
        listWidth,
        fontFamily,
        fontSize,
        tasks,
        locale,
        selectedTaskId: selectedTaskId,
        setSelectedTask,
        onExpanderClick,
    };

    return (
        <div ref={taskListRef} className="gantt-container-left">
            <div className="gantt-table">
                <TaskListHeaderDefault {...headerProps} />
                <div
                    ref={horizontalContainerRef}
                    className={horizontalContainerClass}
                    style={ganttHeight ? {height: ganttHeight} : {}}
                >
                    <TaskListTableDefault {...tableProps} />
                </div>
            </div>
        </div>
    );
};
