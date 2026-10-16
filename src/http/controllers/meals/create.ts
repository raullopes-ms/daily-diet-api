import { ResourceNotFound } from "@/use-cases/errors/resource-not-found";
import { UnauthorizedError } from "@/use-cases/errors/unauthorized-error";
import { makeCreateMealUseCase } from "@/use-cases/factories/make-create-meal-use-case";
import { FastifyReply, FastifyRequest } from "fastify";
import z from "zod";

export async function createMeal(request: FastifyRequest, reply: FastifyReply) {
  const createMealBodySchema = z.object({
    title: z.string().trim(),
    description: z.string().trim(),
    isOnDiet: z.boolean(),
    date: z.coerce.date(),
  });
  const { title, description, isOnDiet, date } = createMealBodySchema.parse(
    request.body,
  );
  try {
    const createMealUseCase = makeCreateMealUseCase();
    await createMealUseCase.execute({
      title,
      description,
      isOnDiet,
      date,
      userId: request.user.sub,
    });
    return reply.status(201).send();
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
