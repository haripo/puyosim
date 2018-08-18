import * as KoaRouter from 'koa-router';
import { getManager, Repository } from "typeorm";
import { Entry } from "./entity/Entry";

export namespace Routes {
  const router = new KoaRouter();

  router.get('/', async (ctx) => {
    ctx.body = 'Hello World!';
  });

  router.get('/api/entries/:id', async ctx => {
    const { id } = ctx.params;

    const entryRepository: Repository<Entry> = getManager().getRepository(Entry);
    const entry = await entryRepository.findOne(id);

    if (entry) {
      ctx.status = 200;
      ctx.body = entry;
    } else {
      ctx.status = 404;
      ctx.body = 'Not found';
    }
  });

  router.post('/api/entries', async ctx => {
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