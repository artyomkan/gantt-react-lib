import React from 'react';

export enum ViewMode {
  Hour = 'Hour',
  QuarterDay = 'Quarter Day',
  HalfDay = 'Half Day',
  Day = 'Day',
  /** ISO-8601 week */
  Week = 'Week',
  Month = 'Month',
  QuarterYear = 'QuarterYear',
  Year = 'Year',
}
export enum TaskType {
  Milestone = 1,
  Task,
  Subtask,
}
export interface Task {
  id: string;
  type: TaskType;
  name: {
    text: string;
    render?: (item: Task) => React.ReactNode;
  };
  start: Date;
  end: Date;
  /**
   * From 0 to 100
   */
  progress: number;
  styles?: {
    backgroundColor?: string;
    backgroundSelectedColor?: string;
    progressColor?: string;
    progressSelectedColor?: string;
  };
  isDisabled?: boolean;
  project?: string;
  dependencies?: string[];
  hideChildren?: boolean;
  displayOrder?: number;
  displayBarText?: boolean;
  withChildren?: boolean;
}

export type ITaskExtended = Task & {
  parentId?: string;
  isVisible: boolean;
  isExpanded?: boolean;
  depth: number;
  childrenWasLoaded?: boolean
};

export interface EventOption {
  /**
   * Time step value for date changes.
   */
  timeStep?: number;
  /**
   * Invokes on bar select on unselect.
   */
  onSelect?: (task: Task, isSelected: boolean) => void;
  /**
   * Invokes on bar double click.
   */
  onDoubleClick?: (task: Task) => void;
  /**
   * Invokes on bar click.
   */
  onClick?: (task: Task) => void;
  /**
   * Invokes on end and start time change. Chart undoes operation if method return false or error.
   */
  onDateChange?: (
    task: Task,
    children: Task[]
  ) => void | boolean | Promise<void> | Promise<boolean>;
  /**
   * Invokes on progress change. Chart undoes operation if method return false or error.
   */
  onProgressChange?: (
    task: Task,
    children: Task[]
  ) => void | boolean | Promise<void> | Promise<boolean>;
  /**
   * Invokes on delete selected task. Chart undoes operation if method return false or error.
   */
  onDelete?: (task: Task) => void | boolean | Promise<void> | Promise<boolean>;
  /**
   * Invokes on expander on task list
   */
  onNewExpanderOpenClick?: (taskId: string) => Promise<Task[]>;
}

export interface DisplayOption {
  viewMode?: ViewMode;
  viewDate?: Date;
  preStepsCount?: number;
  /**
   * Specifies the month name language. Able formats: ISO 639-2, Java Locale
   */
  locale?: string;
  rtl?: boolean;
  displayBarText?: boolean;
}

export interface StylingOption {
  headerHeight?: number;
  columnWidth?: number;
  listWidth?: string;
  rowHeight?: number;
  ganttHeight?: number;
  barCornerRadius?: number;
  handleWidth?: number;
  fontFamily?: string;
  fontSize?: string;
  /**
   * How many of row width can be taken by task.
   * From 0 to 100
   */
  barFill?: number;
  milestoneProgressColor?: string;
  milestoneProgressSelectedColor?: string;
  milestoneBackgroundColor?: string;
  milestoneBackgroundSelectedColor?: string;
  taskProgressColor?: string;
  taskProgressSelectedColor?: string;
  taskBackgroundColor?: string;
  taskBackgroundSelectedColor?: string;
  subtaskProgressColor?: string;
  subtaskProgressSelectedColor?: string;
  subtaskBackgroundColor?: string;
  subtaskBackgroundSelectedColor?: string;
  arrowColor?: string;
  arrowIndent?: number;
  todayColor?: string;
  tooltip?: {
    TooltipContent: React.FC<{
      task: Task;
      fontSize: string;
      fontFamily: string;
    }>;
  };
}

export interface GanttProps extends EventOption, DisplayOption, StylingOption {
  defaultTasks: Task[];
}
