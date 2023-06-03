import { registerAs } from '@nestjs/config';

export interface AuthConfigI {
  accessToken: {
    salt: string;
    expiresIn: string;
  };
  password: {
    salt: string;
  };
}

export default registerAs(
  'auth',
  (): AuthConfigI => ({
    accessToken: {
      salt: process.env.ACCESS_TOKEN_SALT as string,
      expiresIn: '1d',
    },
    password: {
      salt: process.env.PASSWORD_SALT as string,
    },
  }),
);
