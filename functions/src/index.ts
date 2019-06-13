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

function parseHistory(strQueue: string, strHistory: string) {
  const queue = deserializeQueue(strQueue);
  const minimumHistory = deserializeHistoryRecords(strHistory);
  return createHistoryFromMinimumHistory(minimumHistory, queue, minimumHistory.length - 1);
}

export const renderGifMovie = functions.runWith(runtimeOptions).https.onRequest(async (request, response) => {
  const strQueue = request.query.q;
  const strHistory = request.query.h;
  const skin = request.query.skin || 'puyoSkinDefault';

  const history = parseHistory(strQueue, strHistory);
  const renderer = new FieldImageRenderer(theme, skin);
  const buf = await renderer.renderVideo(history);

  response.contentType('image/gif');
  response.send(buf);
});

export const renderGifMovieDebug = functions.runWith(runtimeOptions).https.onRequest(async (request, response) => {
  const strQueue = 'DEpGGxwjkswFyppxxzsGiqqizFDrDxkkxpFlyGDEjDzjjrjysjwxzqljDwxGjFkzrrpyqjDDislyDsFFikDkqyGxEGljrzxpFqjDFDxqziwkjsFzixGjksFlxsDkyEpr';
  const strHistory = 'mmiqsognsjakfklqfqedfdartlnornmagmmobdoep9';

  const history = parseHistory(strQueue, strHistory);
  const renderer = new FieldImageRenderer(theme, 'puyoSkinDefault');
  const buf = await renderer.renderVideo(history);

  response.contentType('image/gif');
  response.send(buf);
});
