import { defineConfig } from "@solidjs/start/config";

export default defineConfig({
    middleware: "src/middleware/index.js",
    env: {
        SESSION_SECRET: process.env.SESSION_SECRET,
        JWT_SECRET: process.env.JWT_SECRET
    }
});