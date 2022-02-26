import { IGroup } from "../entities/IGroup";
import { IEntityService } from "./shared";

// total fake
export const groupService: IEntityService<IGroup> = {
  async fetchById(id: number) {
    return {
      id,
      name: "avengers",
      pupils: [1, 2, 3]
    };
  },
  async saveToServer(data: IGroup) {
    return {
      id: 1,
      ...data
    };
  },
  async update(id: number, data: IGroup) {
    return {
      id,
      ...data
    };
  },
  async remove(id: number) {
    return;
  }
};
