import { UsersRepository } from "@/repositories/users-repository";
import { User } from "../../../generated/prisma/client";
import { ResourceNotFound } from "../errors/resource-not-found";

interface GetProfileUserUseCaseRequest {
  userId: string
}
interface GetProfileUserUseCaseResponse {
  user: User;
}
export class GetProfileUserUseCase {
  constructor(private usersRepository: UsersRepository) {}
  async execute({
   userId
  }: GetProfileUserUseCaseRequest): Promise<GetProfileUserUseCaseResponse> {
    const user = await this.usersRepository.findById(userId)
    if(!user){
      throw new ResourceNotFound();
    }
    return {
      user
    }
  }
}
