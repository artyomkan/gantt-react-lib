import { ITaskExtended, Task } from '../../types/public-types';

export const mapTaskItemArrayToExtended = (
  items: Task[],
  active?: string[]
) => {
  return Object.values(process(items));

  function process(items: Task[], parent?: ITaskExtended, depth = 0) {
    let result: {
      [key: string]: ITaskExtended;
    } = {};

    for (let i = 0; i < items.length; i++) {
      const item: ITaskExtended = {
        ...items[i],
        parent: parent,
        isVisible:
          (!parent || (parent && active?.includes(parent.id))) ?? false,
        depth,
        isExpanded: false,
      };

      result[item.id] = item;

      if (item.children) {
        result = Object.assign(result, process(item.children, item, depth + 1));
      }
    }

    return result;
  }
};
