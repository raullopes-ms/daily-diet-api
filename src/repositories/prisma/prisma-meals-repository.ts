import { prisma } from "@/lib/prisma";
import { MealsRepository } from "../meals-repository";
import { Prisma } from "../../../generated/prisma/client";

export class PrismaMealsRepository implements MealsRepository {
  async create(data: Prisma.MealUncheckedCreateInput) {
    const meal = await prisma.meal.create({
      data,
    });
    return meal;
  }
  async deleteByIdAndUserId(id: number, userId: string) {
    const result = await prisma.meal.deleteMany({
      where: { id, userId },
    });
    return result.count > 0;
  }
  async findManyByUserId(userId: string, isOnDiet?: boolean) {
    return prisma.meal.findMany({
      where: {
        userId,
        ...(isOnDiet !== undefined ? { isOnDiet } : {}),
      },
      orderBy: { date: "desc" },
    });
  }
  async getMetricsByUserId(userId: string) {
    const mealCounts = await prisma.meal.groupBy({
      by: ["isOnDiet"],
      where: { userId },
      _count: { _all: true },
    });
    const mealsOnDiet =
      mealCounts.find((group) => group.isOnDiet)?._count._all ?? 0;
    const mealsOffDiet =
      mealCounts.find((group) => !group.isOnDiet)?._count._all ?? 0;
    return {
      totalMeals: mealsOnDiet + mealsOffDiet,
      mealsOnDiet,
      mealsOffDiet,
    };
  }
}
