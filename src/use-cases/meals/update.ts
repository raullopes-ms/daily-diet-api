import { Meal } from "../../../generated/prisma/client";
import { MealsRepository } from "@/repositories/meals-repository";
import { UsersRepository } from "@/repositories/users-repository";
import { ResourceNotFound } from "../errors/resource-not-found";
import { UnauthorizedError } from "../errors/unauthorized-error";

interface UpdateMealUseCaseRequest {
  mealId: number;
  userId: string;
  title: string;
  description: string;
  isOnDiet: boolean;
  date: Date;
}

interface UpdateMealUseCaseResponse {
  meal: Meal;
}

export class UpdateMealUseCase {
  constructor(
    private mealsRepository: MealsRepository,
    private usersRepository: UsersRepository,
  ) {}

  async execute({
    mealId,
    userId,
    title,
    description,
    isOnDiet,
    date,
  }: UpdateMealUseCaseRequest): Promise<UpdateMealUseCaseResponse> {
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

    const updatedMeal = await this.mealsRepository.update(mealId, {
      title,
      description,
      isOnDiet,
      date,
    });

    return { meal: updatedMeal };
  }
}
