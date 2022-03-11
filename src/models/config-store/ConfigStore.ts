import {
  Config,
  configService,
  IConfigService,
} from "../../services/configService";
import { IConfigStore } from "./IConfigStore";
import { makeAutoObservable } from "mobx";

class ConfigStore implements IConfigStore {
  get isLoading(): boolean {
    return this._isLoading;
  }

  get config(): Config | null {
    return this._config;
  }
  private _isLoading = true;
  private _config: Config | null = null;
  private _configService: IConfigService;

  private async _init() {
    this._config = await this._configService.loadConfig();
    this._isLoading = false;
  }

  constructor(configService: IConfigService) {
    this._configService = configService;
    void this._init();
    makeAutoObservable(this);
  }
}

export const configStore = new ConfigStore(configService);
