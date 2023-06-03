import { registerAs } from '@nestjs/config';

export enum EnvironmentEnum {
  dev = 'dev',
  prod = 'prod',
  test = 'test',
}

export interface AppConfigI {
  env: EnvironmentEnum;
  port: number;
}

export default registerAs(
  'app',
  (): AppConfigI => ({
    env: process.env.NODE_ENV as EnvironmentEnum,
    port: parseInt(process.env.PORT as string, 10) || 3000,
  }),
);
