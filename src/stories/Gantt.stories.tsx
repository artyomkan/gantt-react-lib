import { StoryObj } from '@storybook/react';
import React from 'react';
import infoImg from '../assets/info.svg';
import { Gantt as GanttChart } from '../components/gantt/gantt';
import { GanttProps, Task, TaskType, ViewMode } from '../index';
import { wait } from '../utils/utils';

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
        start: new Date(2024, 1, 2),
        end: new Date(2024, 1, 16),
        progress: 0,
        withChildren: true,
      },
      {
        id: 'Task 3',
        type: TaskType.Task,
        name: {
          text: 'Task 3',
        },
        start: new Date(2024, 0, 2),
        end: new Date(2024, 0, 6),
        progress: 0,
      },
    ];

    const handleExpanderClick: NonNullable<
      GanttProps['onNewExpanderOpenClick']
    > = async (taskId) => {
      await wait({ milliseconds: 1000 });

      function randomIntFromInterval(min = 1, max = 10000) {
        // min and max included
        return Math.floor(Math.random() * (max - min + 1) + min).toString();
      }

      return [
        {
          id: randomIntFromInterval(),
          type: TaskType.Task,
          name: {
            text: 'Task 1',
          },
          start: new Date(2024, 1, 24),
          end: new Date(2024, 1, 28),
          progress: 0,
        } satisfies Task,
        {
          id: randomIntFromInterval(),
          type: TaskType.Task,
          name: {
            text: 'Task 2',
          },
          start: new Date(2024, 2, 24),
          end: new Date(2024, 2, 28),
          progress: 0,
          withChildren: true,
        } satisfies Task,
      ];
    };

    return (
      <>
        <GanttChart
          rtl={false}
          headerHeight={48}
          columnWidth={32}
          locale='ru'
          rowHeight={32}
          viewMode={ViewMode.Day}
          defaultTasks={tasks}
          onNewExpanderOpenClick={handleExpanderClick}
          renderTaskInfo={() => (
            <>
              <img src={infoImg} alt='info'></img>
            </>
          )}
        />
      </>
    );
  },
};
