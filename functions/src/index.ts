import * as functions from 'firebase-functions';
import FieldImageRenderer from './FieldImageRenderer';
import { deserializeHistoryRecords, deserializeQueue } from "../../src/shared/models/serializer";
import { createHistoryFromMinimumHistory, getCurrentPathRecords } from "../../src/shared/models/history";

export const helloWorld = functions.https.onRequest(async (request, response) => {
  const theme = {
    cardBackgroundColor: '#EFEBE9',
    buttonColor: '#8D6E63',
    themeColor: '#6D4C41',
    themeLightColor: '#EFEBE9'
  };

  const strQueue = request.query.q;
  const strHistory = request.query.h;
  const index = parseInt(request.query.i);

  const queue = deserializeQueue(strQueue);
  const history = createHistoryFromMinimumHistory(deserializeHistoryRecords(strHistory), queue, index);
  const path = getCurrentPathRecords(history, index);

  const renderer = new FieldImageRenderer(theme, 'puyoSkinDefault');
  const buf = await renderer.renderVideo(path);
  response.send(buf);
});
