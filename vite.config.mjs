import { defineConfig } from "vitest/config";
export default defineConfig({
  resolve: {
    tsconfigPaths: true,
  },
  test: {
    dir: "src",
    projects: [
      {
        extends: true,
        test: {
          name: "e2e",
          reporters: ['dot'],
          dir: "src/http/controllers",
          environment:
              "./prisma/vitest-environment-prisma/prisma-test-environment.ts"
        },
      },
    ],
  },
});
