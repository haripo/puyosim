import _ from 'lodash';
import { HistoryRecord } from './history';
import { HistoryGraphNode, HistoryGraphPath } from '../selectors/simulatorSelectors';

function getCurrentPathIndexMap(history: HistoryRecord[], historyIndex: number) {
  let indexMap = {};
  {
    let index = historyIndex;
    while (index) {
      const p = history[index];
      if (p.prev === null) {
        break;
      }
      indexMap[p.prev] = index;
      index = p.prev;
    }
  }
  return indexMap;
}

/**
 * 履歴ツリーのレイアウトを計算します．
 *
 * @description
 * 履歴ツリーのノードとパス（エッジ）の位置を返します．
 * 全体的な計算手順：
 * 1. history-tree を深さ優先探索し，ノードとパスの水平位置 (row) を決定する．
 *    垂直位置 (col) は numHands で仮置きし，edit ノードは後続の move ノードと同じ位置に置く．
 * 2. ノードを幅優先探索し，edit ノードが発見され次第，それより深い位置にあるノードを全て 1 つ下にずらす．
 */
export function calcHistoryTreeLayout(
  history: HistoryRecord[],
  queue: number[][],
  historyIndexBase: number) {

  let nodes: HistoryGraphNode[] = new Array(history.length);
  let paths: HistoryGraphPath[] = [];
  let rightmostRow = 0;
  let deepestColumn = 0;
  let currentPathIndexMap = getCurrentPathIndexMap(history, historyIndexBase);

  // create root node
  nodes[0] = {
    row: 0,
    col: 0,
    record: history[0],
    isCurrentNode: true,
    historyIndex: 0
  };

  // calc node and path positions recursively
  const calcLayout = (parentIndex, parentRow, parentCol) => {
    history[parentIndex].next.forEach((childIndex, index) => {
      const col = history[childIndex].numHands;

      if (0 < index) rightmostRow += 1;
      if (deepestColumn < col) deepestColumn = col;

      // create path
      paths[childIndex] = {
        from: { row: parentRow, col: parentCol },
        to: { row: rightmostRow, col: col },
        isCurrentPath: currentPathIndexMap[parentIndex] === childIndex
      };

      // create node
      nodes[childIndex] = {
        row: rightmostRow,
        col: col,
        record: history[childIndex],
        isCurrentNode: childIndex === historyIndexBase,
        historyIndex: childIndex,
      };

      calcLayout(childIndex, rightmostRow, col);
    });
  };
  calcLayout(0, 0, 0);

  // slide col positions
  let layers = _.groupBy(nodes, n => n.col);
  let slidedQueue: number[][] = [];
  let slide = 0;
  for (let i = 0; i <= deepestColumn; i++) {
    const nodeByTypes = _.groupBy(layers[i], n => n.record.type);
    for (let type of ['head', 'move', 'edit']) {
      for (let n of (nodeByTypes[type] || [])) {
        // edit がある場合 1 つ下にずらす
        if (type === 'edit') {
          slide++;
          deepestColumn++;
        }
        n.col += slide;
        if (paths[n.historyIndex]) paths[n.historyIndex].to.col += slide;
        for (let next of n.record.next) {
          if (paths[next]) {
            paths[next].from.col += slide;
          }
        }
      }
    }
    slidedQueue[i + slide + 1] = queue[i];
  }

  return {
    nodes,
    paths,
    queue: slidedQueue,
    width: rightmostRow,
    height: deepestColumn
  };
}