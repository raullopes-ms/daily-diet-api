import request from "supertest";
import { app } from "@/app";
import { afterAll, beforeAll, describe, expect, it } from "vitest";
import { createMeals } from "@/util/create-meal";

describe("List metrics (e2e)", () => {
  beforeAll(async () => {
    await app.ready();
  });
  afterAll(async () => {
    await app.close();
  });
  it("should be able to get meals metrics", async () => {
    const { token } = await createMeals(app);
    const response = await request(app.server)
      .get("/meals/metrics")
      .set("Authorization", `Bearer ${token}`);
      expect(response.statusCode).toBe(200)
  });
});
