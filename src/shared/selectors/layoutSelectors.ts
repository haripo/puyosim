import { fieldCols, fieldRows } from '../utils/constants';
import { LayoutState } from '../reducers/layout';
import _ from 'lodash';

export type Layout = {
  screen: {
    width: number,
    height: number
  },
  contentsMargin: number,
  contentsPadding: number,
  puyoSize: number,
  field: {
    width: number,
    height: number
  }
}

export function getLayout(state: LayoutState): Layout {
  const { width, height } = state;
  const margin = 3;
  const padding = 3;
  let puyoSize = (height - margin * 3 - padding * 4) / (fieldRows + 3);

  if (width - puyoSize * 6 < 150) {
    // sidenav 側の幅が狭くなりすぎないようにする
    puyoSize = ((height - 120) - margin * 3 - padding * 4) / (fieldRows + 3);
  }

  return {
    screen: {
      width: width,
      height: height
    },
    contentsMargin: margin,
    contentsPadding: padding,
    puyoSize: puyoSize,
    field: {
      width: puyoSize * fieldCols + padding * 2,
      height: puyoSize * fieldRows + padding * 2
    }
  }
}

/**
 * Create layout for capturing field
 *
 * 共有用 Field 画像のサイズが端末サイズに依存しないように、
 * 固定サイズの Layout を作成する。
 */
export function getLayoutForCapturingField(): Layout {
  return getLayout({
    width: 400,
    height: 800
  });
}