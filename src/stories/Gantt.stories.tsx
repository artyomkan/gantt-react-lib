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
    const tasks: Task[] = [
      {
        id: 'Milestone 1',
        type: TaskType.Milestone,
        name: {
          text: 'Milestone 1',
        },
        start: new Date('2024-01-02'),
        end: new Date('2024-01-08'),
        progress: 0,
        children: [
          {
            id: 'Task 1',
            type: TaskType.Task,
            name: {
              text: 'Task 1',
            },
            start: new Date('2024-01-04'),
            end: new Date('2024-01-07'),
            progress: 0,
            children: [
              {
                id: 'Subtask 1',
                type: TaskType.Subtask,
                name: {
                  text: 'Subtask 1',
                },
                progress: 0,
                start: new Date('2024-01-05'),
                end: new Date('2024-01-06'),
              },
              {
                id: 'Subtask 2',
                type: TaskType.Subtask,
                name: {
                  text: 'Subtask 2',
                },
                progress: 0,
                start: new Date('2024-01-04'),
                end: new Date('2024-01-07'),
              },
            ],
          },
          {
            id: 'Task 2',
            type: TaskType.Task,
            progress: 0,
            name: {
              text: 'Task 2',
            },
            start: new Date('2024-01-12'),
            end: new Date('2024-01-15'),
          },
        ],
      },
      {
        id: 'Task 3',
        type: TaskType.Task,
        progress: 0,
        name: {
          text: 'Task 3',
        },
        start: new Date('2024-01-20'),
        end: new Date('2024-01-27'),
        children: [
          {
            id: 'Subtask 3',
            type: TaskType.Subtask,
            progress: 0,
            name: {
              text: 'Subtask 3',
            },
            start: new Date('2024-01-22'),
            end: new Date('2024-01-24'),
          },
        ],
      },
      {
        id: 'Task 4',
        type: TaskType.Task,
        progress: 0,
        name: {
          text: 'Task 4',
        },
        start: new Date('2024-01-22'),
        end: new Date('2024-01-23'),
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
        defaultTasks={tasks}
      />
    );
  },
};
