import { TypeOrmModuleOptions } from '@nestjs/typeorm';

// require('dotenv').config();
const config = {
  SERVER_PORT: '3000',
  MODE: 'DEV',
  DB_HOST: 'postgres',
  DB_PORT: '5432',
  DB_USERNAME: 'myuser', // see docker-compose.yml
  DB_PASSWORD: 'mypassword',
  DB_DATABASE_NAME: 'mydb',
};

class ConfigService {
  constructor(private env: { [k: string]: string | undefined }) {}

  private getValue(key: string, throwOnMissing = true): string {
    const value = config[key];
    if (!value && throwOnMissing) {
      throw new Error(`config error - missing env.${key}`);
    }

    return value;
  }

  public ensureValues(keys: string[]) {
    keys.forEach(k => this.getValue(k, true));
    return this;
  }

  public getPort() {
    return this.getValue('SERVER_PORT', true);
  }

  public isProduction() {
    const mode = this.getValue('MODE', false);
    return mode != 'DEV';
  }

  public getTypeOrmConfig(): TypeOrmModuleOptions {
    return {
      name: 'default',
      type: 'postgres',

      host: this.getValue('DB_HOST'),
      port: parseInt(this.getValue('DB_PORT')),
      username: this.getValue('DB_USERNAME'),
      password: this.getValue('DB_PASSWORD'),
      database: this.getValue('DB_DATABASE_NAME'),

      entities: ['dist/**/*.entity.js'],

      logging: true,

      migrationsTableName: 'migration',

      migrations: ['src/migration/*.ts'],

      cli: {
        migrationsDir: 'src/migration',
      },

      ssl: this.isProduction(),

      synchronize: !this.isProduction(),

      dropSchema: false,
    };
  }
}

const configService = new ConfigService(process.env).ensureValues([
  'DB_HOST',
  'DB_PORT',
  'DB_USERNAME',
  'DB_PASSWORD',
  'DB_DATABASE_NAME',
]);

export { configService };
