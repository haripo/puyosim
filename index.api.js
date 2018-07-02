import * as Koa from 'koa';

import { routes } from './src/api/routes';

const app = new Koa();

const config = {
  port: process.env.NODE_PORT || 3000,
  prettyLog: process.env.NODE_ENV == 'development',
};

app.use(routes);

app.listen(config.port);

console.log(`Server running on port ${config.port}`);