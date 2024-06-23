import { Player } from "@lottiefiles/react-lottie-player";
import empty from "../../assets/json/empty.json";
export default function Empty() {
  return (
    <div>
      <Player
        autoplay
        controls
        loop
        src={empty}
        style={{ width: "320px" }}
      ></Player>
    </div>
  );
}
