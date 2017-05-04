
export const putPair = (pair, location, direction) => {
  return {
    type: 'PUT_PAIR',
    payload: {
      pair,
      location,
      direction
    }
  };
};