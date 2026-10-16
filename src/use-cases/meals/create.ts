import { UsersRepository } from "@/repositories/users-repository";
import { Meal } from "../../../generated/prisma/client";
import { MealsRepository } from "@/repositories/meals-repository";
import { ResourceNotFound } from "../errors/resource-not-found";
import { UnauthorizedError } from "../errors/unauthorized-error";

interface CreateMealUseCaseRequest {
  title: string;
  description: string;
  isOnDiet: boolean;
  date: Date;
  userId: string;
}

interface CreateMealUseCaseResponse {
  meal: Meal;
}

export class CreateMealUseCase {
  constructor(
    private mealsRepository: MealsRepository,
    private usersRepository: UsersRepository,
  ) {}
  async execute({
    title,
    description,
    isOnDiet,
    date,
    userId,
  }: CreateMealUseCaseRequest): Promise<CreateMealUseCaseResponse> {
    const user = await this.usersRepository.findById(userId);
    if (!user) {
      throw new ResourceNotFound();
    }
    if (!user.isActive) {
      throw new UnauthorizedError();
    }
    const meal = await this.mealsRepository.create({
      title,
      description,
      isOnDiet,
      date,
      userId,
    });
    return { meal };
  }
}
