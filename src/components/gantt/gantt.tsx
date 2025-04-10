import React, {
  SyntheticEvent,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { convertToBarTasks } from '../../helpers/bar-helper';
import { ganttDateRange, seedDates } from '../../helpers/date-helper';
import { BarTask } from '../../types/bar-task';
import { DateSetup } from '../../types/date-setup';
import { GanttEvent } from '../../types/gantt-task-actions';
import { GanttProps, Task, ViewMode } from '../../types/public-types';
import { CalendarProps } from '../calendar/calendar';
import { GridProps } from '../grid/grid';
import { HorizontalScroll } from '../other/horizontal-scroll';
import { VerticalScroll } from '../other/vertical-scroll';
import { TaskList, TaskListProps } from '../task-list/task-list';
import styles from './gantt.module.css';
import { TaskGantt } from './task-gantt';
import { TaskGanttContentProps } from './task-gantt-content';
import {
  hideChildrenTasks,
  mapTaskArrayToExtended,
  showChildrenTasks,
} from './utils';

export const Gantt: React.FunctionComponent<GanttProps> = ({
  defaultTasks,
  headerHeight = 50,
  columnWidth = 60,
  listWidth = '540px',
  rowHeight = 50,
  ganttHeight = 0,
  viewMode = ViewMode.Day,
  preStepsCount = 1,
  locale = 'en-GB',
  barFill = 60,
  barCornerRadius = 3,
  milestoneProgressColor = '#a3a3ff',
  milestoneProgressSelectedColor = '#8282f5',
  milestoneBackgroundColor = '#b8c2cc',
  milestoneBackgroundSelectedColor = '#aeb8c2',
  taskProgressColor = '#a3a3ff',
  taskProgressSelectedColor = '#8282f5',
  taskBackgroundColor = '#b8c2cc',
  taskBackgroundSelectedColor = '#aeb8c2',
  subtaskProgressColor = '#a3a3ff',
  subtaskProgressSelectedColor = '#8282f5',
  subtaskBackgroundColor = '#b8c2cc',
  subtaskBackgroundSelectedColor = '#aeb8c2',
  rtl = false,
  handleWidth = 8,
  timeStep = 300000,
  arrowColor = 'grey',
  fontFamily = 'Arial, Roboto, Oxygen, Ubuntu, Cantarell, Fira Sans, Droid Sans, Helvetica Neue',
  fontSize = '14px',
  arrowIndent = 20,
  todayColor = 'rgba(252, 248, 227, 0.5)',
  viewDate,
  onDateChange,
  onProgressChange,
  onDoubleClick,
  onClick,
  onDelete,
  onSelect,
  onNewExpanderOpenClick,
  displayBarText = false,
  renderTaskInfo,
}) => {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const taskListRef = useRef<HTMLDivElement>(null);
  const scrollTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const [active, setActive] = React.useState<string[]>([]);
  const [tasks, setTasks] = React.useState(() => {
    return mapTaskArrayToExtended(defaultTasks, active);
  });
  const [dateSetup, setDateSetup] = useState<DateSetup>(() => {
    const [startDate, endDate] = ganttDateRange(tasks, viewMode, preStepsCount);
    return { viewMode, dates: seedDates(startDate, endDate, viewMode) };
  });
  const [currentViewDate, setCurrentViewDate] = useState<Date | undefined>(
    undefined
  );

  const [taskListWidth, setTaskListWidth] = useState(0);
  const [, setSvgContainerWidth] = useState(0);
  const [, setSvgContainerHeight] = useState(ganttHeight);
  const [barTasks, setBarTasks] = useState<BarTask[]>([]);
  const [ganttEvent, setGanttEvent] = useState<GanttEvent>({
    action: '',
  });

  const taskHeight = useMemo(
    () => (rowHeight * barFill) / 100,
    [rowHeight, barFill]
  );

  const [selectedTask, setSelectedTask] = useState<BarTask>();
  const [failedTask, setFailedTask] = useState<BarTask | null>(null);

  const svgWidth = dateSetup.dates.length * columnWidth;
  const ganttFullHeight = barTasks.length * rowHeight;

  const [scrollY, setScrollY] = useState(0);
  const [scrollX, setScrollX] = useState(-1);
  const [ignoreScrollEvent, setIgnoreScrollEvent] = useState(false);

  // task change events
  useEffect(() => {
    const filteredTasks = tasks.filter((x) => x.isVisible);
    const [startDate, endDate] = ganttDateRange(
      filteredTasks,
      viewMode,
      preStepsCount
    );
    let newDates = seedDates(startDate, endDate, viewMode);
    if (rtl) {
      newDates = newDates.reverse();
      if (scrollX === -1) {
        setScrollX(newDates.length * columnWidth);
      }
    }
    setDateSetup({ dates: newDates, viewMode });
    setBarTasks(
      convertToBarTasks(
        filteredTasks,
        newDates,
        columnWidth,
        rowHeight,
        taskHeight,
        barCornerRadius,
        handleWidth,
        rtl,
        displayBarText,
        milestoneProgressColor,
        milestoneProgressSelectedColor,
        milestoneBackgroundColor,
        milestoneBackgroundSelectedColor,
        taskProgressColor,
        taskProgressSelectedColor,
        taskBackgroundColor,
        taskBackgroundSelectedColor,
        subtaskProgressColor,
        subtaskProgressSelectedColor,
        subtaskBackgroundColor,
        subtaskBackgroundSelectedColor
      )
    );
  }, [
    tasks,
    viewMode,
    preStepsCount,
    rowHeight,
    barCornerRadius,
    columnWidth,
    taskHeight,
    handleWidth,
    milestoneProgressColor,
    milestoneProgressSelectedColor,
    milestoneBackgroundColor,
    milestoneBackgroundSelectedColor,
    taskProgressColor,
    taskProgressSelectedColor,
    taskBackgroundColor,
    taskBackgroundSelectedColor,
    subtaskProgressColor,
    subtaskProgressSelectedColor,
    subtaskBackgroundColor,
    subtaskBackgroundSelectedColor,
    rtl,
    scrollX,
  ]);

  useEffect(() => {
    if (
      viewMode === dateSetup.viewMode &&
      ((viewDate && !currentViewDate) ||
        (viewDate && currentViewDate?.valueOf() !== viewDate.valueOf()))
    ) {
      const dates = dateSetup.dates;
      const index = dates.findIndex(
        (d, i) =>
          viewDate.valueOf() >= d.valueOf() &&
          i + 1 !== dates.length &&
          viewDate.valueOf() < dates[i + 1].valueOf()
      );
      if (index === -1) {
        return;
      }
      setCurrentViewDate(viewDate);
      setScrollX(columnWidth * index);
    }
  }, [
    viewDate,
    columnWidth,
    dateSetup.dates,
    dateSetup.viewMode,
    viewMode,
    currentViewDate,
    setCurrentViewDate,
  ]);

  useEffect(() => {
    const { changedTask, action } = ganttEvent;
    if (changedTask) {
      if (action === 'delete') {
        setGanttEvent({ action: '' });
        setBarTasks(barTasks.filter((t) => t.id !== changedTask.id));
      } else if (
        action === 'move' ||
        action === 'end' ||
        action === 'start' ||
        action === 'progress'
      ) {
        const prevStateTask = barTasks.find((t) => t.id === changedTask.id);
        if (
          prevStateTask &&
          (prevStateTask.start.getTime() !== changedTask.start.getTime() ||
            prevStateTask.end.getTime() !== changedTask.end.getTime() ||
            prevStateTask.progress !== changedTask.progress)
        ) {
          // actions for change
          const newTaskList = barTasks.map((t) =>
            t.id === changedTask.id ? changedTask : t
          );
          setBarTasks(newTaskList);
        }
      }
    }
  }, [ganttEvent, barTasks]);

  useEffect(() => {
    if (failedTask) {
      setBarTasks(
        barTasks.map((t) => (t.id !== failedTask.id ? t : failedTask))
      );
      setFailedTask(null);
    }
  }, [failedTask, barTasks]);

  useEffect(() => {
    if (!listWidth) {
      setTaskListWidth(0);
    }
    if (taskListRef.current) {
      setTaskListWidth(taskListRef.current.offsetWidth);
    }
  }, [taskListRef, listWidth]);

  useEffect(() => {
    if (wrapperRef.current) {
      setSvgContainerWidth(wrapperRef.current.offsetWidth - taskListWidth);
    }
  }, [wrapperRef, taskListWidth]);

  useEffect(() => {
    if (ganttHeight) {
      setSvgContainerHeight(ganttHeight + headerHeight);
    } else {
      setSvgContainerHeight(tasks.length * rowHeight + headerHeight);
    }
  }, [ganttHeight, tasks, headerHeight, rowHeight]);

  // scroll events
  useEffect(() => {
    const handleWheel = (event: WheelEvent) => {
      if (event.shiftKey || event.deltaX) {
        const scrollMove = event.deltaX ? event.deltaX : event.deltaY;
        let newScrollX = scrollX + scrollMove;
        if (newScrollX < 0) {
          newScrollX = 0;
        } else if (newScrollX > svgWidth) {
          newScrollX = svgWidth;
        }
        setScrollX(newScrollX);
        event.preventDefault();
      } else if (ganttHeight) {
        let newScrollY = scrollY + event.deltaY;
        if (newScrollY < 0) {
          newScrollY = 0;
        } else if (newScrollY > ganttFullHeight - ganttHeight) {
          newScrollY = ganttFullHeight - ganttHeight;
        }
        if (newScrollY !== scrollY) {
          setScrollY(newScrollY);
          event.preventDefault();
        }
      }

      setIgnoreScrollEvent(true);
    };

    // subscribe if scroll is necessary
    wrapperRef.current?.addEventListener('wheel', handleWheel, {
      passive: false,
    });
    return () => {
      wrapperRef.current?.removeEventListener('wheel', handleWheel);
    };
  }, [
    wrapperRef,
    scrollY,
    scrollX,
    ganttHeight,
    svgWidth,
    rtl,
    ganttFullHeight,
  ]);

  const handleScrollY = (event: SyntheticEvent<HTMLDivElement>) => {
    if (scrollY !== event.currentTarget.scrollTop && !ignoreScrollEvent) {
      setScrollY(event.currentTarget.scrollTop);
      setIgnoreScrollEvent(true);
    } else {
      setIgnoreScrollEvent(false);
    }
  };

  const handleScrollX = (event: SyntheticEvent<HTMLDivElement>) => {
    const newScrollLeft = event.currentTarget.scrollLeft;

    if (scrollX !== newScrollLeft) {
      setScrollX(newScrollLeft);

      setIgnoreScrollEvent(true);

      if (scrollTimeoutRef.current) {
        clearTimeout(scrollTimeoutRef.current);
      }

      scrollTimeoutRef.current = setTimeout(() => {
        setIgnoreScrollEvent(false);
      }, 100);
    }
  };

  /**
   * Handles arrow keys events and transform it to new scroll
   */
  const handleKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
    event.preventDefault();
    let newScrollY = scrollY;
    let newScrollX = scrollX;
    let isX = true;
    switch (event.key) {
      case 'Down': // IE/Edge specific value
      case 'ArrowDown':
        newScrollY += rowHeight;
        isX = false;
        break;
      case 'Up': // IE/Edge specific value
      case 'ArrowUp':
        newScrollY -= rowHeight;
        isX = false;
        break;
      case 'Left':
      case 'ArrowLeft':
        newScrollX -= columnWidth;
        break;
      case 'Right': // IE/Edge specific value
      case 'ArrowRight':
        newScrollX += columnWidth;
        break;
    }
    if (isX) {
      if (newScrollX < 0) {
        newScrollX = 0;
      } else if (newScrollX > svgWidth) {
        newScrollX = svgWidth;
      }
      setScrollX(newScrollX);
    } else {
      if (newScrollY < 0) {
        newScrollY = 0;
      } else if (newScrollY > ganttFullHeight - ganttHeight) {
        newScrollY = ganttFullHeight - ganttHeight;
      }
      setScrollY(newScrollY);
    }
    setIgnoreScrollEvent(true);
  };

  /**
   * Task select event
   */
  const handleSelectedTask = (taskId: string) => {
    const newSelectedTask = barTasks.find((t) => t.id === taskId);
    const oldSelectedTask = barTasks.find(
      (t) => !!selectedTask && t.id === selectedTask.id
    );
    if (onSelect) {
      if (oldSelectedTask) {
        onSelect(oldSelectedTask, false);
      }
      if (newSelectedTask) {
        onSelect(newSelectedTask, true);
      }
    }
    setSelectedTask(newSelectedTask);
  };
  const handleExpanderClick: TaskListProps['onExpanderClick'] = async (
    task,
    isExpanded
  ) => {
    if (isExpanded) {
      const { tasks: newTasks, active: newActive } = hideChildrenTasks(
        task,
        tasks,
        active
      );

      setTasks(newTasks);
      setActive(newActive);
    } else {
      let loadedTasks: Task[] | undefined;

      if (!task.childrenWasLoaded) {
        loadedTasks = await onNewExpanderOpenClick?.(task.id);
      }

      const result = showChildrenTasks(task, tasks, active, loadedTasks);

      if (result) {
        const { tasks: newTasks, active: newActive } = result;

        setTasks(newTasks);
        setActive(newActive);
      }
    }
  };
  const gridProps: GridProps = {
    columnWidth,
    svgWidth,
    tasks: tasks,
    rowHeight,
    dates: dateSetup.dates,
    todayColor,
    rtl,
  };
  const calendarProps: CalendarProps = {
    dateSetup,
    locale,
    viewMode,
    headerHeight,
    columnWidth,
    fontFamily,
    fontSize,
    rtl,
  };
  const barProps: TaskGanttContentProps = {
    tasks: barTasks,
    dates: dateSetup.dates,
    ganttEvent,
    selectedTask,
    rowHeight,
    taskHeight,
    columnWidth,
    arrowColor,
    timeStep,
    fontFamily,
    fontSize,
    arrowIndent,
    svgWidth,
    rtl,
    setGanttEvent,
    setFailedTask,
    setSelectedTask: handleSelectedTask,
    onDateChange,
    onProgressChange,
    onDoubleClick,
    onClick,
    onDelete,
  };

  const tableProps: TaskListProps = {
    rowHeight,
    listWidth,
    fontFamily,
    fontSize,
    tasks: barTasks,
    locale,
    headerHeight,
    scrollY,
    ganttHeight,
    horizontalContainerClass: styles.horizontalContainer,
    selectedTask,
    taskListRef,
    setSelectedTask: handleSelectedTask,
    onExpanderClick: handleExpanderClick,
    renderTaskInfo,
  };
  return (
    <div>
      <div
        className={styles.wrapper}
        onKeyDown={handleKeyDown}
        tabIndex={0}
        ref={wrapperRef}
      >
        {listWidth && <TaskList {...tableProps} />}
        <TaskGantt
          gridProps={gridProps}
          calendarProps={calendarProps}
          barProps={barProps}
          ganttHeight={ganttHeight}
          scrollY={scrollY}
          scrollX={scrollX}
        />
        <VerticalScroll
          ganttFullHeight={ganttFullHeight}
          ganttHeight={ganttHeight}
          headerHeight={headerHeight}
          scroll={scrollY}
          onScroll={handleScrollY}
          rtl={rtl}
        />
      </div>
      <HorizontalScroll
        svgWidth={svgWidth}
        taskListWidth={taskListWidth}
        scroll={scrollX}
        rtl={rtl}
        onScroll={handleScrollX}
      />
    </div>
  );
};
