import { ITaskExtended, Task, TaskType } from '../../types/public-types';

export const mapTaskArrayToExtended = (
  items: Task[],
  active: string[],
  parent?: ITaskExtended
): ITaskExtended[] => {
  return Object.values(process(items, active, parent));

  function process(items: Task[], active: string[], parent?: ITaskExtended) {
    const result: {
      [key: string]: ITaskExtended;
    } = {};

    items.forEach(({ id, type, withChildren, ...rest }) => {
      const canExpand = type === TaskType.Milestone || type === TaskType.Task;
      const parentId = parent?.id;
      const depth = (parent?.depth ?? 0) + 1;

      const item: ITaskExtended = {
        id,
        type,
        ...rest,
        withChildren: canExpand && withChildren,
        parentId,
        isVisible: (!parentId || active?.includes(parentId)) ?? false,
        isExpanded: canExpand ? !!active?.includes(id) : undefined,
        depth,
      };

      result[id] = item;
    });

    return result;
  }
};

export const showChildrenTasks = (
  parent: ITaskExtended,
  tasks: ITaskExtended[],
  active: string[],
  loadedTasks?: Task[]
):
  | {
      tasks: ITaskExtended[];
      active: string[];
    }
  | undefined => {
  const parentIndex = tasks.findIndex((x) => x.id === parent.id);
  if (parentIndex === -1) {
    return;
  }

  const newActive = [...active];
  if (!newActive.includes(parent.id)) {
    newActive.push(parent.id);
  }

  const newTasks = [...tasks];
  newTasks[parentIndex] = {
    ...newTasks[parentIndex],
    isExpanded: true,
    ...(loadedTasks?.length ? { childrenWasLoaded: true } : {}),
  };

  const result = {
    active: newActive,
  };

  if (loadedTasks?.length) {
    const extendedChildren = mapTaskArrayToExtended(
      loadedTasks,
      newActive,
      newTasks[parentIndex]
    );

    newTasks.splice(parentIndex + 1, 0, ...extendedChildren);

    return {
      ...result,
      tasks: newTasks,
    };
  } else {
    return {
      ...result,
      tasks: newTasks.map((x) =>
        x.parentId === parent.id
          ? {
              ...x,
              isVisible: true,
            }
          : x
      ),
    };
  }
};

export const hideChildrenTasks = (
  parent: ITaskExtended,
  tasks: ITaskExtended[],
  active: string[]
): {
  tasks: ITaskExtended[];
  active: string[];
} => {
  const getDescendantIds = (parentId: string): string[] => {
    const childIds = tasks.reduce<string[]>((acc, task) => {
      if (task.parentId === parentId) {
        acc.push(task.id);
      }

      return acc;
    }, []);

    return childIds.reduce<string[]>(
      (acc, childId) => [...acc, childId, ...getDescendantIds(childId)],
      []
    );
  };

  const descendantIds = getDescendantIds(parent.id);

  const newActive = active.filter(
    (x) => x !== parent.id && !descendantIds.includes(x)
  );

  const newTasks = tasks.map((x) => {
    if (x.id === parent.id) {
      return {
        ...x,
        isExpanded: false,
      };
    }

    if (descendantIds.includes(x.id)) {
      return {
        ...x,
        isVisible: false,
        isExpanded: x.isExpanded !== undefined ? false : undefined,
      };
    }

    return x;
  });

  return {
    tasks: newTasks,
    active: newActive,
  };
};
