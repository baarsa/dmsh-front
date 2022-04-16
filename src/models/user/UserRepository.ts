import { GenericEntityRepository } from "../shared";
import { createUserEntity, UserEntity } from "./UserEntity";
import { IUser } from "../../entities/IUser";
import { userService } from "../../services/userService";

class UserRepository extends GenericEntityRepository<UserEntity, IUser> {
  constructor() {
    //maybe: as we use only one service/creator per entity type
    super({
      entityService: userService,
      createEntity: createUserEntity,
    });
  }
}

export const userRepository = new UserRepository();
