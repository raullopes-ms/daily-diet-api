import { PrismaMealsRepository } from "@/repositories/prisma/prisma-meals-repository";
import { PrismaUsersRepository } from "@/repositories/prisma/prisma-users-repository";
import { DeleteMealUseCase } from "../meals/delete";

export function makeDeleteMealUseCase() {
  const mealsRepository = new PrismaMealsRepository();
  const usersRepository = new PrismaUsersRepository();

  return new DeleteMealUseCase(mealsRepository, usersRepository);
}
