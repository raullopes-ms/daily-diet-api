import { PrismaMealsRepository } from "@/repositories/prisma/prisma-meals-repository";
import { PrismaUsersRepository } from "@/repositories/prisma/prisma-users-repository";
import { CreateMealUseCase } from "../meals/create";

export function makeCreateMealUseCase() {
  const mealsRepository = new PrismaMealsRepository();
  const usersRepository = new PrismaUsersRepository()
  return new CreateMealUseCase(mealsRepository, usersRepository);
}
