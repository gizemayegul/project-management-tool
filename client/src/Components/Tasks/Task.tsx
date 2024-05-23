import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

type Props = {
  taskName: string;
  taskId: string;
};

export default function Task({ taskName, taskId }: Props) {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id: taskId });

  const style = {
    transition,
    transform: CSS.Transform.toString(transform),
  };

  return (
    <div
      ref={setNodeRef}
      {...attributes}
      {...listeners}
      style={style}
      className="py-6"
    >
      <div>{taskName}</div>
    </div>
  );
}
