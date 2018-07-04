import * as KoaRouter from 'koa-router';

namespace api {
  const router = new KoaRouter();

  router.get('/', async (ctx) => {
    ctx.body = 'Hello World!';
  });

  router.get('/test', async (ctx) => {
    ctx.status = 201;
    ctx.body = 'test';
  });

  export const routes = router.routes();
}