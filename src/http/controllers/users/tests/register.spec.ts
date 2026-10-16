import request from "supertest";
import { app } from "@/app";
import { afterAll, beforeAll, describe, expect, it } from "vitest";

describe("Register (e2e)", () => {
  beforeAll(async () => {
    await app.ready();
  });
  afterAll(async () => {
    await app.close();
  });
  it("should be able to register", async () => {
    const response = await request(app.server).post("/register").send({
      name: "John Doe",
      email: "johndoe@example.com",
      password: "123456",
    });
    expect(response.statusCode).toEqual(201);
  });

  it("should not be able to register with an existing email", async () => {
    // 1. Cria o usuário com sucesso (201)
    await request(app.server).post("/register").send({
      name: "John Doe",
      email: "johndoe@example.com",
      password: "123456",
    });

    // 2. Tenta criar novamente e espera a falha (409)
    const response = await request(app.server).post("/register").send({
      name: "John Doe",
      email: "johndoe@example.com",
      password: "123456",
    });
    expect(response.statusCode).toBe(409);
    expect(response.body.message).toBe("E-mail already exists.");
  });
});
