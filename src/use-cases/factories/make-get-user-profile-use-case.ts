import { PrismaUsersRepository } from "@/repositories/prisma/prisma-users-repository";
import { GetProfileUserUseCase } from "../users/get-profile";
export function makeGetUserProfileUseCase(){
    const usersRepository = new PrismaUsersRepository();
    const useCase = new GetProfileUserUseCase(usersRepository)
    return useCase
}