import { PrismaMealsRepository } from "@/repositories/prisma/prisma-meals-repository";
import { PrismaUsersRepository } from "@/repositories/prisma/prisma-users-repository";
import { ListMealsByUserUseCase } from "../meals/list-by-user";

export function makeListMealsByUserUseCase() {
  const mealsRepository = new PrismaMealsRepository();
  const usersRepository = new PrismaUsersRepository();

  return new ListMealsByUserUseCase(mealsRepository, usersRepository);
}
