import { useParams } from "react-router-dom";
import { TaskType } from "../../utils/types";
import axios from "axios";
import { apiUrl } from "../../utils/config";
import { useEffect, useState } from "react";

import { useContext } from "react";
import { AuthContext } from "../../Context/AuthContext";

export default function TaskDetails() {
  const { taskId, columnId } = useParams();
  const { token } = useContext(AuthContext);

  const [taskDetail, setTaskDetail] = useState<TaskType>();
  useEffect(() => {
    const fetchTaskDetails = async () => {
      try {
        const response = await axios.get(
          `${apiUrl}/tasks/${columnId}/${taskId}`,
          {
            headers: { Authorization: token },
          }
        );
        setTaskDetail(response.data);
      } catch (error) {
        console.error({
          message: "An error occurred while fetching the boards user",
        });
      }
    };
    fetchTaskDetails();
  }, [taskId, columnId, token]);
  return (
    <div>
      {taskDetail && (
        <>
          <h1>{taskDetail.taskName}</h1>
          <h2>{taskDetail.taskPriority}</h2>
          <h2>{taskDetail.taskDescription}</h2>
        </>
      )}
    </div>
  );
}
