import { fieldCols, fieldRows } from '../utils/constants';
import { LayoutState } from '../reducers/layout';

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
  const puyoSize = (height - margin * 3 - padding * 4) / (fieldRows + 3);
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