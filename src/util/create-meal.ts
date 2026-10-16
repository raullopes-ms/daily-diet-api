import { FastifyInstance } from "fastify";
import request from "supertest";
import { vi } from "vitest";
import { createAndAuthenticateUser } from "./create-and-authenticate-user";

export async function createMeals(_app: FastifyInstance) {
  const { token } = await createAndAuthenticateUser(_app);
  vi.useFakeTimers();
  vi.setSystemTime(new Date("2022-01-20T08:00:00.000Z"));
  const meals = [
    {
      title: "X - Tudo",
      description: "Lanche com os amigos",
      isOnDiet: false,
      date: new Date().toISOString(),
    },
    {
      title: "Almoço",
      description: "Arroz, feijão e frango",
      isOnDiet: true,
      date: new Date().toISOString(),
    },
    {
      title: "Café da manhã",
      description: "Pão com ovos",
      isOnDiet: true,
      date: new Date().toISOString(),
    },
  ];

  try {
    await Promise.all(
      meals.map((meal) =>
        request(_app.server)
          .post("/create-meal")
          .set("Authorization", `Bearer ${token}`)
          .send(meal)
      ),
    );
    return {token, meals}
  } finally {
    vi.useRealTimers();
  }
}
