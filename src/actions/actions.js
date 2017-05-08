export const putNextPair = (position, direction) => {
  return {
    type: 'PUT_NEXT_PAIR',
    payload: {
      position,
      direction
    }
  };
};

export const showHighlights = (position, direction) => {
  return {
    type: 'SHOW_HIGHLIGHTS',
    payload: {
      position,
      direction
    }
  }
};

export const hideHighlights = () => {
  return {
    type: 'HIDE_HIGHLIGHTS'
  }
};

export const vanishPuyos = (positions) => {
  return {
    type: 'VANISH_PUYOS',
    payload: { positions }
  }
};

export const applyGravity = () => {
  return {
    type: 'APPLY_GRAVITY'
  }
};