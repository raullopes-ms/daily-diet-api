import { ResourceNotFound } from "@/use-cases/errors/resource-not-found";
import { UnauthorizedError } from "@/use-cases/errors/unauthorized-error";
import { makeUpdateMealUseCase } from "@/use-cases/factories/make-update-meal-use-case";
import { FastifyReply, FastifyRequest } from "fastify";
import z from "zod";

export async function updateMeal(request: FastifyRequest, reply: FastifyReply) {
  const updateMealParamsSchema = z.object({
    mealId: z.coerce.number().int().positive(),
  });
  const updateMealBodySchema = z.object({
    title: z.string().trim(),
    description: z.string().trim(),
    isOnDiet: z.boolean(),
    date: z.coerce.date(),
  });

  const { mealId } = updateMealParamsSchema.parse(request.params);
  const { title, description, isOnDiet, date } = updateMealBodySchema.parse(
    request.body,
  );
  try {
    const updateMealUseCase = makeUpdateMealUseCase();
    const { meal } = await updateMealUseCase.execute({
      mealId,
      title,
      description,
      isOnDiet,
      date,
      userId: request.user.sub,
    });
    return reply.status(200).send({ meal });
  } catch (error) {
    if (error instanceof ResourceNotFound) {
      return reply.status(404).send({ message: error.message });
    }
    if (error instanceof UnauthorizedError) {
      return reply.status(403).send({ message: error.message });
    }
    throw error;
  }
}
