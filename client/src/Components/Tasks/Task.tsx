type Props = {
  taskName: string;
  taskId: string;
};

export default function Task({ taskName, taskId }: Props) {
  return (
    <div>
      <div>{taskName}</div>
    </div>
  );
}
