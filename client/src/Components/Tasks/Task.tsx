import { useDraggable } from "@dnd-kit/core";
import { CSS } from "@dnd-kit/utilities";
import sort from "../../assets/images/sort.png";
import { useSortable } from "@dnd-kit/sortable";

type Props = {
  taskName: string;
  taskId: string;
  taskPriority: string;
};

export default function Task({ taskName, taskId, taskPriority }: Props) {
  const { attributes, listeners, setNodeRef, transform } = useSortable({
    id: taskId,
    data: { taskName },
  });

  const style = transform
    ? {
        transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
      }
    : undefined;

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="px-6 border-2 my-2 mx-2 flex justify-between bg-purple-300 p-4
      "
    >
      Task
      <div>{taskName}</div>
      <div>{taskPriority}</div>
      <img src={sort} {...attributes} {...listeners} />
    </div>
  );
}
