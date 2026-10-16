import { Meal } from "../../../generated/prisma/client";
import { MealsRepository } from "@/repositories/meals-repository";
import { UsersRepository } from "@/repositories/users-repository";
import { ResourceNotFound } from "../errors/resource-not-found";
import { UnauthorizedError } from "../errors/unauthorized-error";

interface ListMealsByUserUseCaseRequest {
  userId: string;
  isOnDiet?: boolean | undefined;
}

interface ListMealsByUserUseCaseResponse {
  meals: Meal[];
}

export class ListMealsByUserUseCase {
  constructor(
    private mealsRepository: MealsRepository,
    private usersRepository: UsersRepository,
  ) {}
  async execute({
    userId,
    isOnDiet,
  }: ListMealsByUserUseCaseRequest): Promise<ListMealsByUserUseCaseResponse> {
    const user = await this.usersRepository.findById(userId);
    if (!user) {
      throw new ResourceNotFound();
    }
    if (!user.isActive) {
      throw new UnauthorizedError();
    }
    const meals = await this.mealsRepository.findManyByUserId(
      userId,
      isOnDiet,
    );
    return { meals };
  }
}
