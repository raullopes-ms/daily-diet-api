import { ResourceNotFound } from "@/use-cases/errors/resource-not-found";
import { UnauthorizedError } from "@/use-cases/errors/unauthorized-error";
import { makeGetMealMetricsUseCase } from "@/use-cases/factories/make-get-meal-metrics-use-case";
import { FastifyReply, FastifyRequest } from "fastify";

export async function getMealMetrics(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  try {
    const getMealMetricsUseCase = makeGetMealMetricsUseCase();
    const metrics = await getMealMetricsUseCase.execute({
      userId: request.user.sub,
    });
    return reply.status(200).send({ metrics });
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
