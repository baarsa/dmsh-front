import {GenericEntityRepository} from "../shared";
import {ILoad} from "../../entities/ILoad";
import {createProgramEntity, ProgramEntity} from "./ProgramEntity";
import {IProgram} from "../../entities/IProgram";
import {programService} from "../../services/programService";

class ProgramRepository extends GenericEntityRepository<ProgramEntity, IProgram> {
    getByParameters(parameters: Partial<ILoad>) {
        return Object.values(this.entities).filter((entity) =>
            Object.entries(parameters).every(
                ([key, value]) => (entity as any)[key] === value
            )
        );
    }
    constructor() {
        super({
            entityService: programService,
            createEntity: createProgramEntity,
        });
    }
}

export const programRepository = new ProgramRepository();