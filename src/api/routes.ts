import * as KoaRouter from 'koa-router';
import { getManager, Repository } from "typeorm";
import { Entry } from "./entity/Entry";

export namespace Routes {
  const router = new KoaRouter();

  router.get('/', async (ctx) => {
    ctx.body = 'Hello World!';
  });

  router.get('/test', async (ctx) => {
    ctx.status = 201;
    ctx.body = 'test';
  });

  router.post('/api/entry', async ctx => {
    const { history } = ctx.request.body;

    const entry = new Entry();
    entry.history = history;

    const entryRepository: Repository<Entry> = getManager().getRepository(Entry);
    const createdEntry = await entryRepository.save(entry);

    ctx.status = 201;
    ctx.body = createdEntry;
  });

  export const routes = router.routes();
}