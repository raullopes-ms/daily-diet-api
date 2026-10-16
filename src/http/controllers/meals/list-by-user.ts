import { ResourceNotFound } from "@/use-cases/errors/resource-not-found";
import { UnauthorizedError } from "@/use-cases/errors/unauthorized-error";
import { makeListMealsByUserUseCase } from "@/use-cases/factories/make-list-meals-by-user-use-case";
import { FastifyReply, FastifyRequest } from "fastify";
import z from "zod";

export async function listMealsByUser(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const listMealsQuerySchema = z.object({
    isOnDiet: z.enum(["true", "false"]).optional(),
  });
  const { isOnDiet } = listMealsQuerySchema.parse(request.query);
  try {
    const listMealsByUserUseCase = makeListMealsByUserUseCase();
    const { meals } = await listMealsByUserUseCase.execute({
      userId: request.user.sub,
      isOnDiet: isOnDiet === undefined ? undefined : isOnDiet === "true",
    });
    return reply.status(200).send({ meals });
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
