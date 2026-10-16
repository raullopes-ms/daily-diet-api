import fastifyJwt from "@fastify/jwt";
import fastify from "fastify";
import { ZodError, z } from "zod";
import { env } from "./env";
import { usersRoutes } from "./http/controllers/users/routes";
import { mealsRoutes } from "./http/controllers/meals/routes";

export const app = fastify();

app.register(fastifyJwt, {
  secret: env.JWT_SECRET,
  sign: {
    expiresIn: "10m",
  },
});

app.register(usersRoutes)
app.register(mealsRoutes)


app.setErrorHandler((error, _, reply) => {
  if (error instanceof ZodError) {
    return reply.status(400).send({
      message: "Validation error",
      issues: z.treeifyError(error),
    });
  }
  if (env.NODE_ENV != "production") {
    console.error(error);
  } else {
    // Implementar um logger para registrar os erros em produção
  }
  return reply.status(500).send({
    message: "Internal Server Error",
  });
});
