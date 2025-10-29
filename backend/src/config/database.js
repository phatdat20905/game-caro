// backend/config/database.js
import { Sequelize } from 'sequelize';
import config from './config.js';

const env = process.env.NODE_ENV || 'development';
const dbConfig = config[env];

const sequelize = new Sequelize(
  dbConfig.database,
  dbConfig.username,
  dbConfig.password,
  {
    host: dbConfig.host,
    port: dbConfig.port,
    dialect: dbConfig.dialect,
    logging: dbConfig.logging,
    pool: dbConfig.pool,
    dialectOptions: dbConfig.dialectOptions
  }
);

export const connectDatabase = async () => {
  try {
    await sequelize.authenticate();
    console.log('PostgreSQL connection established.');

    if (env === 'development') {
      await sequelize.sync({ alter: true });
      console.log('DB synced (dev mode).');
    }
  } catch (error) {
    console.error('Unable to connect to database:', error);
    throw error;
  }
};

export { sequelize };
export default sequelize;