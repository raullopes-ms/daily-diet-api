import { ResourceNotFound } from "@/use-cases/errors/resource-not-found";
import { UnauthorizedError } from "@/use-cases/errors/unauthorized-error";
import { makeDeleteMealUseCase } from "@/use-cases/factories/make-delete-meal-use-case";
import { FastifyReply, FastifyRequest } from "fastify";
import z from "zod";

export async function deleteMeal(request: FastifyRequest, reply: FastifyReply) {
  const deleteMealParamsSchema = z.object({
    mealId: z.coerce.number().int().positive(),
  });
  const { mealId } = deleteMealParamsSchema.parse(request.params);
  try {
    const deleteMealUseCase = makeDeleteMealUseCase();
    await deleteMealUseCase.execute({
      mealId,
      userId: request.user.sub,
    });
    return reply.status(204).send();
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
