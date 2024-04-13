import {defineConfig} from "vite";
import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  define: {
    __APP_VERSION__: JSON.stringify("v1.0.0"),
    __API_URL__: JSON.stringify(""), //change that to your server (LEFT EMPTY IF PROD)
  },
});
