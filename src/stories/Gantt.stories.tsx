import {StoryObj} from '@storybook/react';
import React from 'react';
import {Gantt as GanttChart} from '../components/gantt/gantt';
import {GanttProps, Task, TaskType, ViewMode} from '../index';
import {wait} from "../utils/utils";

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
                withChildren: true
            },
            {
                id: 'Task 3',
                type: TaskType.Task,
                name: {
                    text: 'Task 3',
                },
                start: new Date('2024-01-20'),
                end: new Date('2024-01-27'),
                progress: 0,
            },
            {
                id: 'Task 4',
                type: TaskType.Task,
                name: {
                    text: 'Task 4',
                },
                start: new Date('2024-01-22'),
                end: new Date('2024-01-23'),
                progress: 0,
                withChildren: true
            },
        ];

        const handleExpanderClick: NonNullable<GanttProps["onExpanderClick"]> = async (taskId, isExpanded) => {
            await wait({milliseconds: 1000});

            function randomIntFromInterval(min = 1, max = 100) { // min and max included
                return Math.floor(Math.random() * (max - min + 1) + min).toString();
            }

            return [
                {
                    id: randomIntFromInterval(),
                    type: TaskType.Task,
                    name: {
                        text: 'Task 1'
                    },
                    start: new Date('2024-01-04'),
                    end: new Date('2024-01-07'),
                    progress: 0,
                } satisfies Task,
                {
                    id: randomIntFromInterval(),
                    type: TaskType.Task,
                    name: {
                        text: 'Task 2'
                    },
                    start: new Date('2024-01-03'),
                    end: new Date('2024-01-04'),
                    progress: 0,
                    withChildren: true
                } satisfies Task
            ]
        }

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
                onExpanderClick={handleExpanderClick}
            />
        );
    },
};
