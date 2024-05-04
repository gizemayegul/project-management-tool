import { Player, Controls } from "@lottiefiles/react-lottie-player";
import animation from "../../assets/notfoundAnimation.json";

export default function NotFound() {
  return (
    <div>
      <Player
        autoplay
        controls
        loop
        src={animation}
        style={{ width: "320px" }}
      ></Player>
    </div>
  );
}
