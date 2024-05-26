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
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({
      id: taskId,
    });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="px-6 border-2 my-2 mx-2 flex justify-between"
    >
      <div>{taskName}</div>
      <div>{taskPriority}</div>
      <img src={sort} {...attributes} {...listeners} />
    </div>
  );
}
