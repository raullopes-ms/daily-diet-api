import request from "supertest";
import { app } from "@/app";
import { afterAll, beforeAll, beforeEach, describe, expect, it } from "vitest";
import { prisma } from "@/lib/prisma";
describe("Authenticate  (e2e)", () => {
  beforeAll(async () => {
    await app.ready();
  });
  afterAll(async () => {
    await app.close();
  });
  beforeEach(async () => {
    await prisma.user.deleteMany(); 
  })
  it("should be able to authenticate", async () => {
    await request(app.server).post("/register").send({
      name: "John Doe",
      email: "johndoe@example.com",
      password: "123456",
    });
    const response = await request(app.server).post("/sessions").send({
      email: "johndoe@example.com",
      password: "123456",
    });
    expect(response.statusCode).toBe(200);
  });
  it("should not be able to authenticate with invalid credentials", async () => {
    await request(app.server).post("/register").send({
      name: "John Doe",
      email: "johndoe@example.com",
      password: "123456",
    });
    const response = await request(app.server).post("/sessions").send({
      email: "johndoe@example.com",
      password: "1234578",
    });
    expect(response.statusCode).toBe(401);
    expect(response.body.message).toBe("Invalid credentials.");
  });
});
