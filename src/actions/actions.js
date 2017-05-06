export const putNextPair = (location, direction) => {
  return {
    type: 'PUT_NEXT_PAIR',
    payload: {
      location,
      direction
    }
  };
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