import { FastifyInstance } from "fastify";
import { createMeal } from "./create";
import { verifyJwt } from "@/http/middlewares/verify-jwt";
import { listMealsByUser } from "./list-by-user";
import { deleteMeal } from "./delete";
import { getMealMetrics } from "./get-metrics";
import { getMealById } from "./get-by-id";

export async function mealsRoutes(app: FastifyInstance) {
  app.post("/create-meal", { onRequest: verifyJwt }, createMeal);
  app.get("/meals", { onRequest: verifyJwt }, listMealsByUser);
  app.get("/meals/metrics", { onRequest: verifyJwt }, getMealMetrics);
  app.get("/meals/:mealId", { onRequest: verifyJwt }, getMealById);
  app.delete("/meals/:mealId", { onRequest: verifyJwt }, deleteMeal);
}
