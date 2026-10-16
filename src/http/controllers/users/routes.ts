import { FastifyInstance } from "fastify";
import { authenticate } from "./authenticate";
import { register } from "./register";
import { verifyJwt } from "@/http/middlewares/verify-jwt";
import { profile } from "./profile";

export async function usersRoutes(app: FastifyInstance) {
  app.post("/register", register);
  app.post("/sessions", authenticate);
  app.get("/me", {onRequest: verifyJwt}, profile)
}
