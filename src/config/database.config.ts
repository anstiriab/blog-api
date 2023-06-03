import { registerAs } from '@nestjs/config';
import { join } from 'path';

export interface DatabaseConfigI {
  type: string;
  url: string;
  entities: string[];
  synchronize: boolean;
}

export default registerAs(
  'database',
  (): DatabaseConfigI => ({
    type: 'postgres',
    url: process.env.DB_URL as string,
    entities: [join(__dirname, '/../**', '*.entity.{ts,js}')],
    synchronize: true,
  }),
);
