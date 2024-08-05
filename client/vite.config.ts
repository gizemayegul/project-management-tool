import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react-swc";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "");
  return {
    plugins: [react()],
    resolve: {
      extensions: [".js", ".ts", ".jsx", ".tsx", ".json", ".mjs"],
    },
    define: {
      __APP_ENV__: JSON.stringify(env.APP_ENV),
    },
    build: {
      outDir: "dist", // This should place the build in `client/dist`
    },
    server: {
      host: true,
      strictPort: true,
      port: 8000,
    },
  };
});
