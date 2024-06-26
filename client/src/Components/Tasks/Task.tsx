import { TaskType } from "../../utils/types";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

export default function Task({ ...task }: TaskType) {
  const {
    isDragging,
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
  } = useSortable({
    id: task._id,
    data: {
      type: "task",
      task: task,
    },
  });
  const style = {
    transition,
    transform: CSS.Transform.toString(transform),
  };
  if (isDragging) {
    return (
      <div
        ref={setNodeRef}
        style={style}
        className="
        opacity-30
      bg-mainBackgroundColor  h-[100px] min-h-[100px] items-center flex text-left rounded-xl border-2 border-slate-500  cursor-grab relative
      "
      />
    );
  }

  return (
    <div
      className="bg-mainBackgroundColor h-[100px] min-h-[100px] items-center flex text-left rounded-xl hover:ring-2 hover:ring-inset hover:border-slate-500  cursor-grab relative task"
      ref={setNodeRef}
      style={style}
      {...listeners}
      {...attributes}
    >
      <div>{task.taskName}</div>
    </div>
  );
}
