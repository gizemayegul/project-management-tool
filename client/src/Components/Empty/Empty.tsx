import { Player } from "@lottiefiles/react-lottie-player";
import empty2 from "../../assets/json/empty.json";
export default function Empty() {
  return (
    <div>
      <Player
        autoplay={true}
        controls
        loop
        src={empty2}
        style={{ height: "300px", width: "300px" }}
      ></Player>
    </div>
  );
}
