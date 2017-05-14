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
  };
};

export const hideHighlights = () => {
  return {
    type: 'HIDE_HIGHLIGHTS'
  };
};

export const vanishPuyos = (positions) => {
  return {
    type: 'VANISH_PUYOS',
    payload: { positions }
  };
};

export const applyGravity = () => {
  return {
    type: 'APPLY_GRAVITY'
  };
};

export const doChainVanishingPhase = () => {
  return {
    type: 'CHAIN_VANISHING_PHASE'
  };
};

export const doChainDroppingPhase = () => {
  return {
    type: 'CHAIN_DROPPING_PHASE'
  };
};

export const finishDroppingAnimations = () => {
  return {
    type: 'FINISH_DROPPING_ANIMATIONS'
  };
};

export const finishVanishingAnimations = () => {
  return {
    type: 'FINISH_VANISHING_ANIMATIONS'
  };
};