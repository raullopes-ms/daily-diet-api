import { Meal } from "../../../generated/prisma/client";
import { MealsRepository } from "@/repositories/meals-repository";
import { UsersRepository } from "@/repositories/users-repository";
import { ResourceNotFound } from "../errors/resource-not-found";
import { UnauthorizedError } from "../errors/unauthorized-error";

interface GetMealByIdUseCaseRequest {
  mealId: number;
  userId: string;
}

interface GetMealByIdUseCaseResponse {
  meal: Meal;
}

export class GetMealByIdUseCase {
  constructor(
    private mealsRepository: MealsRepository,
    private usersRepository: UsersRepository,
  ) {}

  async execute({
    mealId,
    userId,
  }: GetMealByIdUseCaseRequest): Promise<GetMealByIdUseCaseResponse> {
    const user = await this.usersRepository.findById(userId);
    if (!user) {
      throw new ResourceNotFound();
    }
    if (!user.isActive) {
      throw new UnauthorizedError();
    }
    const meal = await this.mealsRepository.findByIdAndUserId(mealId, userId);
    if (!meal) {
      throw new ResourceNotFound();
    }
    return { meal };
  }
}
