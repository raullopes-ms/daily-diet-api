import { MealsRepository } from "@/repositories/meals-repository";
import { UsersRepository } from "@/repositories/users-repository";
import { ResourceNotFound } from "../errors/resource-not-found";
import { UnauthorizedError } from "../errors/unauthorized-error";

interface GetMealMetricsUseCaseRequest {
  userId: string;
}

interface GetMealMetricsUseCaseResponse {
  totalMeals: number;
  mealsOnDiet: number;
  mealsOffDiet: number;
  percentageOnDiet: number;
}

export class GetMealMetricsUseCase {
  constructor(
    private mealsRepository: MealsRepository,
    private usersRepository: UsersRepository,
  ) {}

  async execute({
    userId,
  }: GetMealMetricsUseCaseRequest): Promise<GetMealMetricsUseCaseResponse> {
    const user = await this.usersRepository.findById(userId);
    if (!user) {
      throw new ResourceNotFound();
    }
    if (!user.isActive) {
      throw new UnauthorizedError();
    }
    const metrics = await this.mealsRepository.getMetricsByUserId(userId);
    const percentageOnDiet =
      metrics.totalMeals === 0
        ? 0
        : Number(((metrics.mealsOnDiet / metrics.totalMeals) * 100).toFixed(2));
    return { ...metrics, percentageOnDiet };
  }
}
