import { useContext } from "react";
import { AuthContext } from "../../Context/AuthContext";

export default function Dashboard() {
  const { user } = useContext(AuthContext);

  return <div> {user && user.name}</div>;
}
