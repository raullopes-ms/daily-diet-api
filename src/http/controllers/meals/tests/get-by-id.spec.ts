import request from "supertest";
import { app } from "@/app";
import { afterAll, beforeAll, describe, expect, it } from "vitest";
import { createAndAuthenticateUser } from "@/util/create-and-authenticate-user";

describe("Get meal id (e2e)", () => {
  beforeAll(async () => {
    await app.ready();
  });
  afterAll(async () => {
    await app.close();
  });
  it("should be able to get meal id", async () => {
    const { token } = await createAndAuthenticateUser(app);
    const createResponse = await request(app.server)
      .post("/create-meal")
      .set("Authorization", `Bearer ${token}`)
      .send({
        title: "X - Tudo",
        description: "Lanche com os amigos",
        isOnDiet: false,
        date: new Date().toISOString(),
      });
    const mealId = createResponse.body.meal.id;
    const detailsResponse = await request(app.server)
      .get(`/meals/${mealId}`)
      .set("Authorization", `Bearer ${token}`);
    expect(detailsResponse.statusCode).toEqual(200);
    expect(detailsResponse.body.meal.id).toEqual(mealId);
  });
});
