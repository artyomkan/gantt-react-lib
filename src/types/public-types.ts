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
    renderInfo?: EventOption['renderTaskInfo'];
  };
  start: Date;
  end: Date;
  status?: {
    color: string;
    name: string;
  };
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
  childrenWasLoaded?: boolean;
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
  onExpanderClick?: (
    type: IExpanderClickType,
    task: Pick<ITaskExtended, 'id' | 'type' | 'start' | 'end' | 'name'>,
    tasks?: Pick<ITaskExtended, 'status'>[]
  ) => void;
  renderTaskInfo?: (taskId: string) => React.ReactElement;
  renderDate?: (value: Date) => React.ReactNode;
}

export enum IExpanderClickType {
  Expand = 1,
  Collapse,
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
  i18n?: {
    table?: {
      columns?: {
        name?: string;
        from?: string;
        to?: string;
      };
    };
  };
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
}

export interface GanttProps extends EventOption, DisplayOption, StylingOption {
  defaultTasks: Task[];
  loadChildrenFunc?: (
    parent: Pick<ITaskExtended, 'id' | 'type' | 'start' | 'end' | 'name'>
  ) => Promise<Task[]>;
}
