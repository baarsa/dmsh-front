import { Config } from "../../services/configService";

export interface IConfigStore {
  isLoading: boolean;
  config: Config | null;
}
