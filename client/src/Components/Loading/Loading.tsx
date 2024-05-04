import loading from "../../assets/loadingAnimation.json";
import { Player } from "@lottiefiles/react-lottie-player";
export default function Loading() {
  return (
    <>
      <Player autoplay controls loop src={loading} style={{ width: "320px" }}>
        <div className="flex items-center justify-center">Loading...</div>
      </Player>
    </>
  );
}
