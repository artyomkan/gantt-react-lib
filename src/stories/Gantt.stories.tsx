import { StoryObj } from '@storybook/react';
import React from 'react';
import { Gantt as GanttChart } from '../components/gantt/gantt';
import { Task, TaskType, ViewMode } from '../types/public-types';

export default {
  title: 'Example/Gantt',
};

type Story = StoryObj;

export const Gantt: Story = {
  render: () => {
    const allTasks: Task[] = [
      {
        id: '1',
        type: TaskType.Task,
        name: 'Task 1 Task 1 Task 1 Task 1 Task 1 Task 1 Task 1 Task 1 Task 1 Task 1 Task 1 Task 1',
        start: new Date('2025-03-02'),
        end: new Date('2025-03-02'),
        progress: 20,
      },
      {
        id: '2',
        type: TaskType.Task,
        name: 'Task 2',
        start: new Date('2025-03-02'),
        end: new Date('2025-03-04'),
        progress: 40,
      },
      {
        id: '3',
        type: TaskType.Task,
        name: 'Task 3',
        start: new Date('2025-05-01'),
        end: new Date('2025-05-01'),
        progress: 40,
      },
    ];

    return (
      <GanttChart
        rtl={false}
        headerHeight={48}
        columnWidth={32}
        displayBarText={false}
        locale='ru'
        rowHeight={32}
        viewMode={ViewMode.Day}
        tasks={allTasks}
      />
    );
  },
};
