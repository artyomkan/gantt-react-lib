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

function randomIntFromInterval(min = 1, max = 10000) {
  // min and max included
  return Math.floor(Math.random() * (max - min + 1) + min).toString();
}

export const Gantt: Story = {
  render: () => {
    const tasks: Task[] = [
      {
        id: randomIntFromInterval(),
        type: TaskType.Milestone,
        name: {
          text: 'Milestone 1',
        },
        status: {
          color: '#000000',
          name: 'To do',
        },
        start: new Date(2025, 3, 15),
        end: new Date(2025, 3, 27),
        progress: 0,
        withChildren: true,
      },
      {
        id: randomIntFromInterval(),
        type: TaskType.Task,
        name: {
          text: 'Task 3',
        },
        start: new Date(2025, 1, 4),
        end: new Date(2025, 3, 18),
        progress: 0,
      },
    ];

    const handleExpanderClick: NonNullable<
      GanttProps['onExpanderClick']
    > = async (taskId) => {
      await wait({ milliseconds: 1000 });

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
          rowHeight={32}
          viewMode={ViewMode.Day}
          defaultTasks={tasks}
          onExpanderClick={handleExpanderClick}
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
