import { BarTask } from '../types/bar-task';
import { BarMoveAction } from '../types/gantt-task-actions';
import { ITaskExtended, TaskType } from '../types/public-types';

export const convertToBarTasks = (
  tasks: ITaskExtended[],
  dates: Date[],
  columnWidth: number,
  rowHeight: number,
  taskHeight: number,
  barCornerRadius: number,
  handleWidth: number,
  rtl: boolean,
  displayBarText: boolean,
  milestoneProgressColor: string,
  milestoneProgressSelectedColor: string,
  milestoneBackgroundColor: string,
  milestoneBackgroundSelectedColor: string,
  taskProgressColor: string,
  taskProgressSelectedColor: string,
  taskBackgroundColor: string,
  taskBackgroundSelectedColor: string,
  subtaskProgressColor: string,
  subtaskProgressSelectedColor: string,
  subtaskBackgroundColor: string,
  subtaskBackgroundSelectedColor: string
) => {
  let barTasks = tasks.map((t, i) =>
    convertToBarTask(
      t,
      i,
      dates,
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

  // set dependencies
  barTasks = barTasks.map((task) => {
    const dependencies = task.dependencies || [];
    for (let j = 0; j < dependencies.length; j++) {
      const dependence = barTasks.findIndex(
        (value) => value.id === dependencies[j]
      );
      if (dependence !== -1) barTasks[dependence].barChildren.push(task);
    }
    return task;
  });

  return barTasks;
};

const convertToBarTask = (
  task: ITaskExtended,
  index: number,
  dates: Date[],
  columnWidth: number,
  rowHeight: number,
  taskHeight: number,
  barCornerRadius: number,
  handleWidth: number,
  rtl: boolean,
  displayBarText: boolean,
  milestoneProgressColor: string,
  milestoneProgressSelectedColor: string,
  milestoneBackgroundColor: string,
  milestoneBackgroundSelectedColor: string,
  taskProgressColor: string,
  taskProgressSelectedColor: string,
  taskBackgroundColor: string,
  taskBackgroundSelectedColor: string,
  subtaskProgressColor: string,
  subtaskProgressSelectedColor: string,
  subtaskBackgroundColor: string,
  subtaskBackgroundSelectedColor: string
): BarTask => {
  let progressColor = milestoneProgressColor;
  let progressSelectedColor = milestoneProgressSelectedColor;
  let backgroundColor = milestoneBackgroundColor;
  let backgroundSelectedColor = milestoneBackgroundSelectedColor;

  switch (task.type) {
    case TaskType.Task:
      progressColor = taskProgressColor;
      progressSelectedColor = taskProgressSelectedColor;
      backgroundColor = taskBackgroundColor;
      backgroundSelectedColor = taskBackgroundSelectedColor;

      break;

    case TaskType.Subtask:
      progressColor = subtaskProgressColor;
      progressSelectedColor = subtaskProgressSelectedColor;
      backgroundColor = subtaskBackgroundColor;
      backgroundSelectedColor = subtaskBackgroundSelectedColor;

      break;
  }

  return convertToBar(
    task,
    index,
    dates,
    columnWidth,
    rowHeight,
    taskHeight,
    barCornerRadius,
    handleWidth,
    rtl,
    displayBarText,
    progressColor,
    progressSelectedColor,
    backgroundColor,
    backgroundSelectedColor
  );
};

const convertToBar = (
  task: ITaskExtended,
  index: number,
  dates: Date[],
  columnWidth: number,
  rowHeight: number,
  taskHeight: number,
  barCornerRadius: number,
  handleWidth: number,
  rtl: boolean,
  displayBarText: boolean,
  barProgressColor: string,
  barProgressSelectedColor: string,
  barBackgroundColor: string,
  barBackgroundSelectedColor: string
): BarTask => {
  let x1: number;
  let x2: number;
  if (rtl) {
    x2 = taskXCoordinateRTL(task.start, dates, columnWidth);
    x1 = taskXCoordinateRTL(task.end, dates, columnWidth);
  } else {
    x1 = taskXCoordinate(task.start, dates, columnWidth);
    x2 = taskXCoordinate(task.end, dates, columnWidth, false);
  }

  const [progressWidth, progressX] = progressWithByParams(
    x1,
    x2,
    task.progress,
    rtl
  );
  const y = taskYCoordinate(index, rowHeight, taskHeight);

  const styles = {
    backgroundColor: barBackgroundColor,
    backgroundSelectedColor: barBackgroundSelectedColor,
    progressColor: barProgressColor,
    progressSelectedColor: barProgressSelectedColor,
    ...task.styles,
  };
  return {
    displayBarText,
    ...task,
    x1,
    x2,
    y,
    index,
    progressX,
    progressWidth,
    barCornerRadius,
    handleWidth,
    hideChildren: undefined,
    height: taskHeight,
    barChildren: [],
    styles,
  };
};

const taskXCoordinate = (
  xDate: Date,
  dates: Date[],
  columnWidth: number,
  isStartDate = true
) => {
  const index =
    dates.findIndex((d) => d.getTime() >= xDate.getTime()) -
    (isStartDate ? 1 : 0);

  return index * columnWidth;
};
const taskXCoordinateRTL = (
  xDate: Date,
  dates: Date[],
  columnWidth: number
) => {
  let x = taskXCoordinate(xDate, dates, columnWidth);
  x += columnWidth;
  return x;
};
const taskYCoordinate = (
  index: number,
  rowHeight: number,
  taskHeight: number
) => {
  return index * rowHeight + (rowHeight - taskHeight) / 2;
};

export const progressWithByParams = (
  taskX1: number,
  taskX2: number,
  progress: number,
  rtl: boolean
) => {
  const progressWidth = (taskX2 - taskX1) * progress * 0.01;
  let progressX: number;
  if (rtl) {
    progressX = taskX2 - progressWidth;
  } else {
    progressX = taskX1;
  }
  return [progressWidth, progressX];
};

const progressByX = (x: number, task: BarTask) => {
  if (x >= task.x2) return 100;
  else if (x <= task.x1) return 0;
  else {
    const barWidth = task.x2 - task.x1;
    return Math.round(((x - task.x1) * 100) / barWidth);
  }
};
const progressByXRTL = (x: number, task: BarTask) => {
  if (x >= task.x2) return 0;
  else if (x <= task.x1) return 100;
  else {
    const barWidth = task.x2 - task.x1;
    return Math.round(((task.x2 - x) * 100) / barWidth);
  }
};

export const getProgressPoint = (
  progressX: number,
  taskY: number,
  taskHeight: number
) => {
  const point = [
    progressX - 5,
    taskY + taskHeight,
    progressX + 5,
    taskY + taskHeight,
    progressX,
    taskY + taskHeight - 8.66,
  ];
  return point.join(',');
};

const startByX = (x: number, xStep: number, task: BarTask) => {
  if (x >= task.x2 - task.handleWidth * 2) {
    x = task.x2 - task.handleWidth * 2;
  }
  const steps = Math.round((x - task.x1) / xStep);
  const additionalXValue = steps * xStep;
  return task.x1 + additionalXValue;
};

const endByX = (x: number, xStep: number, task: BarTask) => {
  if (x <= task.x1 + task.handleWidth * 2) {
    x = task.x1 + task.handleWidth * 2;
  }
  const steps = Math.round((x - task.x2) / xStep);
  const additionalXValue = steps * xStep;
  return task.x2 + additionalXValue;
};

const moveByX = (x: number, xStep: number, task: BarTask) => {
  const steps = Math.round((x - task.x1) / xStep);
  const additionalXValue = steps * xStep;
  const newX1 = task.x1 + additionalXValue;
  const newX2 = newX1 + task.x2 - task.x1;
  return [newX1, newX2];
};

const dateByX = (
  x: number,
  taskX: number,
  taskDate: Date,
  xStep: number,
  timeStep: number
) => {
  let newDate = new Date(((x - taskX) / xStep) * timeStep + taskDate.getTime());
  newDate = new Date(
    newDate.getTime() +
      (newDate.getTimezoneOffset() - taskDate.getTimezoneOffset()) * 60000
  );
  return newDate;
};

/**
 * Method handles event in real time(mousemove) and on finish(mouseup)
 */
export const handleTaskBySVGMouseEvent = (
  svgX: number,
  action: BarMoveAction,
  selectedTask: BarTask,
  xStep: number,
  timeStep: number,
  initEventX1Delta: number,
  rtl: boolean
): { isChanged: boolean; changedTask: BarTask } =>
  handleTaskBySVGMouseEventForBar(
    svgX,
    action,
    selectedTask,
    xStep,
    timeStep,
    initEventX1Delta,
    rtl
  );

const handleTaskBySVGMouseEventForBar = (
  svgX: number,
  action: BarMoveAction,
  selectedTask: BarTask,
  xStep: number,
  timeStep: number,
  initEventX1Delta: number,
  rtl: boolean
): { isChanged: boolean; changedTask: BarTask } => {
  const changedTask: BarTask = { ...selectedTask };
  let isChanged = false;
  switch (action) {
    case 'progress':
      if (rtl) {
        changedTask.progress = progressByXRTL(svgX, selectedTask);
      } else {
        changedTask.progress = progressByX(svgX, selectedTask);
      }
      isChanged = changedTask.progress !== selectedTask.progress;
      if (isChanged) {
        const [progressWidth, progressX] = progressWithByParams(
          changedTask.x1,
          changedTask.x2,
          changedTask.progress,
          rtl
        );
        changedTask.progressWidth = progressWidth;
        changedTask.progressX = progressX;
      }
      break;
    case 'start': {
      const newX1 = startByX(svgX, xStep, selectedTask);
      changedTask.x1 = newX1;
      isChanged = changedTask.x1 !== selectedTask.x1;
      if (isChanged) {
        if (rtl) {
          changedTask.end = dateByX(
            newX1,
            selectedTask.x1,
            selectedTask.end,
            xStep,
            timeStep
          );
        } else {
          changedTask.start = dateByX(
            newX1,
            selectedTask.x1,
            selectedTask.start,
            xStep,
            timeStep
          );
        }
        const [progressWidth, progressX] = progressWithByParams(
          changedTask.x1,
          changedTask.x2,
          changedTask.progress,
          rtl
        );
        changedTask.progressWidth = progressWidth;
        changedTask.progressX = progressX;
      }
      break;
    }
    case 'end': {
      const newX2 = endByX(svgX, xStep, selectedTask);
      changedTask.x2 = newX2;
      isChanged = changedTask.x2 !== selectedTask.x2;
      if (isChanged) {
        if (rtl) {
          changedTask.start = dateByX(
            newX2,
            selectedTask.x2,
            selectedTask.start,
            xStep,
            timeStep
          );
        } else {
          changedTask.end = dateByX(
            newX2,
            selectedTask.x2,
            selectedTask.end,
            xStep,
            timeStep
          );
        }
        const [progressWidth, progressX] = progressWithByParams(
          changedTask.x1,
          changedTask.x2,
          changedTask.progress,
          rtl
        );
        changedTask.progressWidth = progressWidth;
        changedTask.progressX = progressX;
      }
      break;
    }
    case 'move': {
      const [newMoveX1, newMoveX2] = moveByX(
        svgX - initEventX1Delta,
        xStep,
        selectedTask
      );
      isChanged = newMoveX1 !== selectedTask.x1;
      if (isChanged) {
        changedTask.start = dateByX(
          newMoveX1,
          selectedTask.x1,
          selectedTask.start,
          xStep,
          timeStep
        );
        changedTask.end = dateByX(
          newMoveX2,
          selectedTask.x2,
          selectedTask.end,
          xStep,
          timeStep
        );
        changedTask.x1 = newMoveX1;
        changedTask.x2 = newMoveX2;
        const [progressWidth, progressX] = progressWithByParams(
          changedTask.x1,
          changedTask.x2,
          changedTask.progress,
          rtl
        );
        changedTask.progressWidth = progressWidth;
        changedTask.progressX = progressX;
      }
      break;
    }
  }
  return { isChanged, changedTask };
};
