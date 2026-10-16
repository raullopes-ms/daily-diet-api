import { ResourceNotFound } from "@/use-cases/errors/resource-not-found";
import { UnauthorizedError } from "@/use-cases/errors/unauthorized-error";
import { makeGetMealByIdUseCase } from "@/use-cases/factories/make-get-meal-by-id-use-case";
import { FastifyReply, FastifyRequest } from "fastify";
import z from "zod";

export async function getMealById(request: FastifyRequest, reply: FastifyReply) {
  const getMealParamsSchema = z.object({
    mealId: z.coerce.number().int().positive(),
  });
  const { mealId } = getMealParamsSchema.parse(request.params);
  try {
    const getMealByIdUseCase = makeGetMealByIdUseCase();
    const { meal } = await getMealByIdUseCase.execute({
      mealId,
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
