import { useDraggable } from "@dnd-kit/core";
import { CSS } from "@dnd-kit/utilities";
import sort from "../../assets/images/sort.png";

type Props = {
  taskName: string;
  taskId: string;
};

export default function Task({ taskName, taskId }: Props) {
  const { attributes, listeners, setNodeRef, transform } = useDraggable({
    id: taskId.toString(),
  });

  const style = {
    transform: CSS.Transform.toString(transform),
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="px-6 border-2 my-2 mx-2 flex justify-between"
    >
      <div>{taskName}</div>
      <div>
        <img src={sort} {...attributes} {...listeners} />
      </div>
    </div>
  );
}
