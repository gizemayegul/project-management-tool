import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react-swc";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "");
  return {
    plugins: [react()],
    resolve: {
      extensions: [".mjs", ".js", ".ts", ".jsx", ".tsx", ".json"],
    },
    define: {
      __APP_ENV__: JSON.stringify(env.APP_ENV),
    },
    build: {
      outDir: "dist", // This should place the build in `client/dist`
    },
    "serve:production": "vite build --mode production && serve -s dist -l 5006",
  };
});
