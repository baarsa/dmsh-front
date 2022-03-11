export type Config = {
  startTime: number;
  endTime: number;
  lessonMaxLength: number;
  pauseLength: number;
};

export interface IConfigService {
  loadConfig(): Promise<Config>;
}

export const configService: IConfigService = {
  loadConfig() {
    return new Promise((res) => {
      setTimeout(() => {
        res({
          startTime: 10 * 60,
          endTime: 20 * 60,
          lessonMaxLength: 180,
          pauseLength: 5,
        });
      }, 500);
    });
  },
};
