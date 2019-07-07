import _ from 'lodash';
import * as functions from 'firebase-functions';
import FieldImageRenderer from './FieldImageRenderer';
import { deserializeHistoryRecords, deserializeQueue } from "../../src/shared/models/serializer";
import { createHistoryFromMinimumHistory } from "../../src/shared/models/history";

const runtimeOptions: functions.RuntimeOptions = {
  timeoutSeconds: 300,
  memory: '1GB'
};

const theme = {
  cardBackgroundColor: '#EFEBE9',
  buttonColor: '#8D6E63',
  themeColor: '#6D4C41',
  themeLightColor: '#EFEBE9'
};

async function createGifMovie(strQueue: string, strHistory: string, skin: string) {
  const queue = deserializeQueue(strQueue);
  const minimumHistory = deserializeHistoryRecords(strHistory);
  const history = createHistoryFromMinimumHistory(minimumHistory, queue, minimumHistory.length - 1);

  const renderer = new FieldImageRenderer(theme, skin);
  return await renderer.renderVideo(history);
}

async function createGif(strField: string, skin: string) {
  const field = _.chunk(strField.split('').map(v => parseInt(v)), 6);
  const renderer = new FieldImageRenderer(theme, skin);
  return await renderer.renderField(field);
}

export const renderGif = functions.runWith(runtimeOptions).https.onRequest(async (request, response) => {
  const skin = request.query.skin || 'puyoSkinDefault';
  const data = await createGif(request.query.s, skin);

  response.set('Cache-Control', 'public, max-age=300, s-maxage=5184000'); // 5184000 = 2 months
  if (request.query.base64) {
    response.send(data.toString('base64'));
  } else {
    response.contentType('image/gif');
    response.send(data);
  }
});

export const renderGifDebug = functions.runWith(runtimeOptions).https.onRequest(async (request, response) => {
  const s = `000000\
000000\
000000\
000000\
000000\
000000\
000000\
000000\
000000\
000001\
000003\
000002\
000000`;
  response.contentType('image/gif');
  response.send(await createGif(s, 'puyoSkinDefault'));
});


export const renderGifMovie = functions.runWith(runtimeOptions).https.onRequest(async (request, response) => {
  const strQueue = request.query.q;
  const strHistory = request.query.h;
  const skin = request.query.skin || 'puyoSkinDefault';
  const data = await createGifMovie(strQueue, strHistory, skin);

  response.set('Cache-Control', 'public, max-age=300, s-maxage=5184000'); // 5184000 = 2 months
  if (request.query.base64) {
    response.send(data.toString('base64'));
  } else {
    response.contentType('video/mp4');
    response.send(data);
  }
});

export const renderGifMovieDebug = functions.runWith(runtimeOptions).https.onRequest(async (request, response) => {
  const strQueue = 'DEpGGxwjkswFyppxxzsGiqqizFDrDxkkxpFlyGDEjDzjjrjysjwxzqljDwxGjFkzrrpyqjDDislyDsFFikDkqyGxEGljrzxpFqjDFDxqziwkjsFzixGjksFlxsDkyEpr';
  const strHistory = 'mmiqsognsjakfklqfqedfdartlnornmagmmobdoep9';

  response.contentType('video/mp4');
  response.send(await createGifMovie(strQueue, strHistory, 'puyoSkinDefault'));
});
