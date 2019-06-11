import * as functions from 'firebase-functions';
import FieldImageRenderer from './FieldImageRenderer';
import { deserializeHistoryRecords, deserializeQueue } from "../../src/shared/models/serializer";
import { createHistoryFromMinimumHistory } from "../../src/shared/models/history";

const runtimeOptions: functions.RuntimeOptions = {
  timeoutSeconds: 300,
  memory: '1GB'
};

export const helloWorld = functions.runWith(runtimeOptions).https.onRequest(async (request, response) => {
  const theme = {
    cardBackgroundColor: '#EFEBE9',
    buttonColor: '#8D6E63',
    themeColor: '#6D4C41',
    themeLightColor: '#EFEBE9'
  };

  const strQueue = 'DEpGGxwjkswFyppxxzsGiqqizFDrDxkkxpFlyGDEjDzjjrjysjwxzqljDwxGjFkzrrpyqjDDislyDsFFikDkqyGxEGljrzxpFqjDFDxqziwkjsFzixGjksFlxsDkyEpr';
  const strHistory = 'mmiqsognsjakfklqfqedfdartlnornmagmmobdoep9';

  // const strQueue = request.query.q;
  // const strHistory = request.query.h;

  const queue = deserializeQueue(strQueue);
  const minimumHistory = deserializeHistoryRecords(strHistory);
  const history = createHistoryFromMinimumHistory(minimumHistory, queue, minimumHistory.length - 1);

  const renderer = new FieldImageRenderer(theme, 'puyoSkinDefault');
  const buf = await renderer.renderVideo(history);

  response.send(buf);
});
