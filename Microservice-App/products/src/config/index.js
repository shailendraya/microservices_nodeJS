const dotEnv = require("dotenv");

if (process.env.NODE_ENV !== "prod") {
  const configFile = `./.env.${process.env.NODE_ENV}`;
  dotEnv.config({ path: configFile });
} else {
  dotEnv.config();
}
console.log('Database connections---->', process.env.PORT, process.env.MONGODB_URI, process.env.APP_SECRET)

const APP_SECRET ='jg_youtube_tutorial'

// # Mongo DB
const MONGODB_URI='mongodb://localhost:27017/ms_product'

// # Port
const PORT=8002

const MESSAGE_BROKER_URL = 'amqp://localhost'
module.exports = {
  PORT: PORT,
  DB_URL: MONGODB_URI,
  APP_SECRET: APP_SECRET,
  MESSAGE_BROKER_URL: MESSAGE_BROKER_URL,
  EXCHANGE_NAME: 'ONLINE_SHOPPING',
  SHOPPING_BINDING_KEY: 'SHOPPING_SERVICE',
  CUSTOMER_BINDING_KEY: 'CUSTOMER_SERVICE',
  QUEUE_NAME: 'PRODUCT_QUEUE'
};
