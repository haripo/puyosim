
function makeActionCreator(type, ...argNames) {
  return function(...args) {
    let action = { type };
    argNames.forEach((arg, index) => {
      action[argNames[index]] = args[index]
    });
    return action
  }
}

export const PUT_NEXT_PAIR = 'PUT_NEXT_PAIR';
export const SHOW_HIGHLIGHTS = 'SHOW_HIGHLIGHTS';
export const HIDE_HIGHLIGHTS = 'HIDE_HIGHLIGHTS';
export const DO_CHAIN_VANISHING_PHASE = 'DO_CHAIN_VANISHING_PHASE';
export const DO_CHAIN_DROPPING_PHASE = 'DO_CHAIN_DROPPING_PHASE';
export const FINISH_VANISHING_ANIMATIONS = 'FINISH_VANISHING_ANIMATIONS';
export const FINISH_DROPPING_ANIMATIONS = 'FINISH_DROPPING_ANIMATIONS';
export const APPLY_GRAVITY = 'APPLY_GRAVITY';
export const VANISH_PUYOS = 'VANISH_PUYOS';
export const CHAIN_FINISHED = 'CHAIN_FINISHED';
export const UNDO_FIELD = 'UNDO_FIELD';

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

export const hideHighlights = makeActionCreator(HIDE_HIGHLIGHTS);
export const doChainVanishingPhase = makeActionCreator(DO_CHAIN_VANISHING_PHASE);
export const doChainDroppingPhase = makeActionCreator(DO_CHAIN_DROPPING_PHASE);
export const finishDroppingAnimations = makeActionCreator(FINISH_DROPPING_ANIMATIONS);
export const finishVanishingAnimations = makeActionCreator(FINISH_VANISHING_ANIMATIONS);
export const applyGravity = makeActionCreator(APPLY_GRAVITY);
export const vanishPuyos = makeActionCreator(VANISH_PUYOS);
export const chainFinished = makeActionCreator(CHAIN_FINISHED);
export const undoField = makeActionCreator(UNDO_FIELD);
