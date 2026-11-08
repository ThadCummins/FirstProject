import { defineConfig } from "vitest/config";

// Unit tests live next to the code they test, in src/
export default defineConfig({
  test: { include: ["src/**/*.test.ts"] },
});
