import "reflect-metadata";
import * as Koa from 'koa';
import bodyParser from 'koa-bodyparser'

import { Routes } from './src/api/routes';
import { createConnection } from 'typeorm/index';
import { Entry } from './src/api/entity/Entry';

const app = new Koa();

const config = {
  port: process.env.NODE_PORT || 3000,
  prettyLog: process.env.NODE_ENV === 'development',
};

createConnection({
  type: "mysql",
  host: "localhost",
  port: 3306,
  username: "puyosim",
  password: "secret",
  database: "puyosim",
  entities: [
    Entry
  ],
  synchronize: true,
  logging: true
}).then(connection => {
  app.use(bodyParser());
  app.use(Routes.routes);
  app.listen(config.port);

  console.log(`Server running on port ${config.port}`);
}).catch(error => {
  console.error(error)
});

