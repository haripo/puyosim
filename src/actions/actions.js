export const putNextPair = (position, direction) => {
  return {
    type: 'PUT_NEXT_PAIR',
    payload: {
      position,
      direction
    }
  };
};

export const showHighlight = (position, direction) => {
  return {
    type: 'SHOW_HIGHLIGHT',
    payload: {
      position,
      direction
    }
  }
};

export const hideHighlight = (location, direction) => {
  return {
    type: 'HIDE_HIGHLIGHT'
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