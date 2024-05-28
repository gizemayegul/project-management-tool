// import { useState, useEffect } from "react";
// import axios from "axios";
import sort from "../../assets/images/sort.png";
import { useDraggable } from "@dnd-kit/core";

export default function TaskWrapper(props: any) {
  const { attributes, listeners, setNodeRef, transform } = useDraggable({
    id: props.taskId,
  });

  const style = transform
    ? {
        transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
      }
    : undefined;
  return (
    <div className="bg-purple-400 p-3 border-4" ref={setNodeRef} style={style}>
      <img src={sort} {...attributes} {...listeners} />
      TaskWrapper
      {props.children}
    </div>
  );
}
