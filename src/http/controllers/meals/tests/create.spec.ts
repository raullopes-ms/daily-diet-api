import request from "supertest";
import { app } from "@/app";
import {
  afterAll,
  beforeAll,
  describe,
  afterEach,
  expect,
  it,
  vi,
} from "vitest";
import { createAndAuthenticateUser } from "@/util/create-and-authenticate-user";

describe("Create meal (e2e", () => {
  beforeAll(async () => {
    await app.ready();
  });
  afterAll(async () => {
    await app.close();
  });
  afterEach(() => {
    vi.useRealTimers();
  });
  it("should be able to create a meal", async () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date(2022, 0, 20, 8, 0, 0));
    const { token } = await createAndAuthenticateUser(app);
    const response = await request(app.server)
      .post("/create-meal")
      .set("Authorization", `Bearer ${token}`)
      .send({
        title: "X - Tudo",
        description: "Lanche com os amigos",
        isOnDiet: false,
        date: new Date().toISOString(),
      });
    expect(response.statusCode).toEqual(201);
  });
});
