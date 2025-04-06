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
        name: 'Task 1',
        start: new Date('2024-01-02'),
        end: new Date('2024-01-02'),
        progress: 20,
      },
      {
        id: '2',
        type: TaskType.Task,
        name: 'Task 2',
        start: new Date('2024-01-02'),
        end: new Date('2024-01-04'),
        progress: 40,
      },
    ];

    return <GanttChart viewMode={ViewMode.Day} tasks={allTasks} />;
  },
};
