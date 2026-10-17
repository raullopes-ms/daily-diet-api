import { Prisma, Meal } from "../../generated/prisma/client";

export interface MealsRepository {
  create(data: Prisma.MealUncheckedCreateInput): Promise<Meal>;
  update(id: number, data: Prisma.MealUncheckedUpdateInput): Promise<Meal>;
  deleteByIdAndUserId(id: number, userId: string): Promise<boolean>;
  findByIdAndUserId(id: number, userId: string): Promise<Meal | null>;
  findManyByUserId(userId: string, isOnDiet?: boolean): Promise<Meal[]>;
  getMetricsByUserId(userId: string): Promise<{
    totalMeals: number;
    mealsOnDiet: number;
    mealsOffDiet: number;
  }>;
}
