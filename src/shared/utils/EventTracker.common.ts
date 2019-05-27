// @ts-ignore
import { sendEvent, setUserId } from './EventTracker';
import { Stack } from "../models/stack";
import { HistoryRecord } from "../models/history";

// TODO: openHistoryFromSimulator 以外のイベントはまだ使ってない
// TODO: historyRecord を送ると payload が長すぎてエラーになる

export class EventTracker {
  static openHistoryFromSimulator(): void {
    sendEvent('open_history', { from: 'simulator' });
  }

  static share(stack: Stack, history: HistoryRecord[], historyIndex: number) {
    sendEvent('share', { stack, history, historyIndex });
  }

  // TODO: chain を正確に補足するためには，runChainAnimation, Vanish, Gravity あたりをリファクタリングする必要がある
  static chain(stack: Stack, history: HistoryRecord[], historyIndex: number) {
    sendEvent('chain', { stack, history, historyIndex });
  }

  static reset() {
    sendEvent('reset');
  }

  static restart() {
    sendEvent('restart');
  }

  static loadArchive() {
    sendEvent('load_archive');
  }

  static saveArchive() {
     sendEvent('save_archive');
  }
}
