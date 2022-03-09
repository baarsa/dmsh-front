import {GenericEntityRepository} from "../shared";
import {createLoadEntity, LoadEntity} from "./LoadEntity";
import { ILoad } from "../../entities/ILoad";
import {loadService} from "../../services/loadService";

class LoadRepository extends GenericEntityRepository<LoadEntity, ILoad> {
    getByParameters(parameters: Partial<ILoad>) {
        // todo improve types. maybe move to GER?
        return Object.values(this.entities)
            .filter(entity => Object.entries(parameters).every(([key, value]) => (entity as any)[key] === value));
    }
    constructor() {
        super({
            entityService: loadService,
            createEntity: createLoadEntity,
        });
    }
}

export const loadRepository = new LoadRepository();