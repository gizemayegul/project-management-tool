import { UniqueIdentifier, useDraggable } from "@dnd-kit/core";
import { CSS } from "@dnd-kit/utilities";
import sort from "../../assets/images/sort.png";
import { useSortable } from "@dnd-kit/sortable";

type Props = {
  taskName: string;
  taskId: string;
  taskPriority: string;
  columnId: UniqueIdentifier;
};

export default function Task({ taskName, taskId, taskPriority, task }: Props) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: taskId,
    data: {
      type: "task",
    },
  });
  const style = {
    transform: CSS.Transform.toString(transform),
    transition: transition || "transform 250ms ease", // Ensuring a smooth transition
    opacity: isDragging ? 0.8 : undefined, // Optionally reduce opacity while dragging
    zIndex: isDragging ? 1000 : "auto", // Ensure the dragging item is on top
  };
  return (
    <div
      {...attributes}
      ref={setNodeRef}
      style={style}
      className="px-6 border-2 my-2 mx-2 flex justify-between bg-purple-300 p-4
      "
    >
      <div>{taskName}</div>
      <div>{taskPriority}</div>
      <img src={sort} {...listeners} />
      Task
    </div>
  );
}
