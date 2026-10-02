// backend/config/database.js
const { Sequelize } = require('sequelize');
const env = require('./env');
const path = require('path');

let sequelize;

if (env.DB.DIALECT === 'postgres') {
  // Connect via DATABASE_URL if available, otherwise host/port/credentials
  if (env.DATABASE_URL && env.DATABASE_URL.startsWith('postgres')) {
    sequelize = new Sequelize(env.DATABASE_URL, {
      dialect: 'postgres',
      logging: false,
      dialectOptions: env.DB.SSL
        ? {
            ssl: {
              require: true,
              rejectUnauthorized: false
            }
          }
        : {},
      pool: {
        max: 10,
        min: 0,
        acquire: 30000,
        idle: 10000
      }
    });
  } else {
    sequelize = new Sequelize(env.DB.NAME, env.DB.USER, env.DB.PASSWORD, {
      host: env.DB.HOST,
      port: env.DB.PORT,
      dialect: 'postgres',
      logging: false,
      dialectOptions: env.DB.SSL
        ? {
            ssl: {
              require: true,
              rejectUnauthorized: false
            }
          }
        : {},
      pool: {
        max: 10,
        min: 0,
        acquire: 30000,
        idle: 10000
      }
    });
  }
} else {
  // SQLite mode for immediate out-of-the-box local development
  sequelize = new Sequelize({
    dialect: 'sqlite',
    storage: path.join(__dirname, '..', 'career_copilot.sqlite'),
    logging: false
  });
}

/**
 * Test database connectivity
 * Verifies the connection to PostgreSQL or SQLite database
 */
const testConnection = async () => {
  try {
    await sequelize.authenticate();
    console.log(`✅ [Database] Connected successfully using ${sequelize.getDialect()}!`);
    return true;
  } catch (err) {
    console.error(`❌ [Database] Connection error on ${sequelize.getDialect()}:`, err.message);
    if (sequelize.getDialect() === 'postgres') {
      console.warn(`💡 [Database Tip] If PostgreSQL is not running locally, set DB_DIALECT=sqlite in backend/.env for zero-config offline mode.`);
    }
    throw err;
  }
};

module.exports = {
  sequelize,
  testConnection
};
