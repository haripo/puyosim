export const putNextPair = (location, direction) => {
  return {
    type: 'PUT_NEXT_PAIR',
    payload: {
      location,
      direction
    }
  };
};