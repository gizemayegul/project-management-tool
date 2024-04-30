import "./App.css";
import "./index.css";
import { useEffect, useState } from "react";
import axios from "axios";
const API_URL = import.meta.env.VITE_SERVER_URL;
console.log(API_URL);

function App() {
  const [data, setData] = useState<string>("");

  useEffect(() => {
    (async function () {
      try {
        const response = await axios.get(API_URL);
        setData(response.data);
        console.log(response);
      } catch (err) {
        console.log(err);
      }
    })();
  }, []);
  return (
    <>
      <div className="text-3xl font-bold underline">{data}</div>
    </>
  );
}

export default App;
