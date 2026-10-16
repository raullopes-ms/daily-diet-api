import { PrismaMealsRepository } from "@/repositories/prisma/prisma-meals-repository";
import { PrismaUsersRepository } from "@/repositories/prisma/prisma-users-repository";
import { GetMealMetricsUseCase } from "../meals/get-metrics";

export function makeGetMealMetricsUseCase() {
  const mealsRepository = new PrismaMealsRepository();
  const usersRepository = new PrismaUsersRepository();

  return new GetMealMetricsUseCase(mealsRepository, usersRepository);
}
