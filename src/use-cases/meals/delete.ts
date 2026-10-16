import { MealsRepository } from "@/repositories/meals-repository";
import { UsersRepository } from "@/repositories/users-repository";
import { ResourceNotFound } from "../errors/resource-not-found";
import { UnauthorizedError } from "../errors/unauthorized-error";

interface DeleteMealUseCaseRequest {
  mealId: number;
  userId: string;
}

export class DeleteMealUseCase {
  constructor(
    private mealsRepository: MealsRepository,
    private usersRepository: UsersRepository,
  ) {}
  async execute({ mealId, userId }: DeleteMealUseCaseRequest): Promise<void> {
    const user = await this.usersRepository.findById(userId);
    if (!user) {
      throw new ResourceNotFound();
    }
    if (!user.isActive) {
      throw new UnauthorizedError();
    }
    const deleted = await this.mealsRepository.deleteByIdAndUserId(
      mealId,
      userId,
    );
    if (!deleted) {
      throw new ResourceNotFound();
    }
  }
}
