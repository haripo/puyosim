import { createSelector } from "reselect";
import { State } from "../reducers";
import { serializeHistoryRecords, serializeQueue } from "../models/serializer";
import { getCurrentPathRecords } from "../models/history";

function createShareURL(q: string, h: string | null): string {
  const head = 'https://rens.im/link/';
  const query = h ? `q=${q}&h=${h}&i=${0}` : `q=${q}`;
  const link = encodeURIComponent('https://rens.im/v?' + query);
  return `${head}?link=${link}&apn=com.puyosimulator&isi=1435074935&ibi=com.haripo.puyosim&amv=17&efr=1`;
}

const functionHost = __DEV__
  ? 'https://rensim-staging.firebaseapp.com'
  : 'https://rens.im';

function createQuery(params) {
  let str: string[] = [];
  for (let p in params) {
    if (params.hasOwnProperty(p)) {
      str.push(encodeURIComponent(p) + "=" + encodeURIComponent(params[p]));
    }
  }
  return str.join("&");
}

export const getWholePathShareUrl = createSelector(
  [
    (state: State) => state.simulator.queue,
    (state: State) => state.simulator.history,
    (state: State) => state.simulator.historyIndex
  ],
  (queue, history, historyIndex) => {
    const q = serializeQueue(queue);
    const current = serializeHistoryRecords(history);
    return createShareURL(q, current);
  }
);

export const getCurrentPathShareUrl = createSelector(
  [
    (state: State) => state.simulator.queue,
    (state: State) => state.simulator.history,
    (state: State) => state.simulator.historyIndex
  ],
  (queue, history, historyIndex) => {
    const q = serializeQueue(queue);
    const current = serializeHistoryRecords(getCurrentPathRecords(history, historyIndex));
    return createShareURL(q, current);
  }
);

export const getStackImageUrl = createSelector(
  [
    (state: State) => state.simulator.stack
  ],
  (stack) => {
    const s = stack.map(r => r.join('')).join('');
    const param = { s };
    return `${ functionHost }/functions/snapshot?${ createQuery(param) }`;
  }
);

export const getHistoryMovieUrl = createSelector(
  [
    (state: State) => state.simulator.queue,
    (state: State) => state.simulator.history,
    (state: State) => state.simulator.historyIndex,
  ],
  (queue, history, historyIndex) => {
    const q = serializeQueue(queue);
    const h = serializeHistoryRecords(getCurrentPathRecords(history, historyIndex));
    const param = { q, h };
    return `${ functionHost }/functions/movie?${ createQuery(param) }`;
  }
);