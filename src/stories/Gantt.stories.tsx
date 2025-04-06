import { StoryObj } from '@storybook/react';
import React from 'react';
import { Gantt as GanttChart } from '../components/gantt/gantt';
import { Task, ViewMode } from '../types/public-types';

export default {
  title: 'Example/Gantt',
};

type Story = StoryObj;

export const Gantt: Story = {
  render: () => {
    const allTasks: Task[] = [
      {
        id: '1',
        type: 'task',
        name: 'Task 1',
        start: new Date('2024-01-02'),
        end: new Date('2024-01-08'),
        progress: 20,
      },
    ];

    return <GanttChart viewMode={ViewMode.Day} tasks={allTasks} />;
  },
};
