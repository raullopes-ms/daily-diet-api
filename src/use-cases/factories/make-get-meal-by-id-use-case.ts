import { PrismaMealsRepository } from "@/repositories/prisma/prisma-meals-repository";
import { PrismaUsersRepository } from "@/repositories/prisma/prisma-users-repository";
import { GetMealByIdUseCase } from "../meals/get-by-id";

export function makeGetMealByIdUseCase() {
  const mealsRepository = new PrismaMealsRepository();
  const usersRepository = new PrismaUsersRepository();

  return new GetMealByIdUseCase(mealsRepository, usersRepository);
}
