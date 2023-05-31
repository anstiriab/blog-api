import appConfig, { AppConfigI } from './app.config';
import authConfig, { AuthConfigI } from './auth.config';
import databaseConfig, { DatabaseConfigI } from './database.config';
import { validateConfig } from './env.validation';

const configurations = [appConfig, authConfig, databaseConfig];

export {
  configurations,
  validateConfig,
  AppConfigI,
  AuthConfigI,
  DatabaseConfigI,
};
