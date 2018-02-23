function makeActionCreator(type, ...argNames) {
  return function (...args) {
    let action = { type };
    argNames.forEach((arg, index) => {
      action[argNames[index]] = args[index];
    });
    return action;
  };
}

export const INITIALIZE_SIMULATOR = 'INITIALIZE_SIMULATOR';
export const PUT_NEXT_PAIR = 'PUT_NEXT_PAIR';
export const ROTATE_HIGHLIGHTS_LEFT = 'ROTATE_HIGHLIGHTS_LEFT';
export const ROTATE_HIGHLIGHTS_RIGHT = 'ROTATE_HIGHLIGHTS_RIGHT';
export const MOVE_HIGHLIGHTS_LEFT = 'MOVE_HIGHLIGHTS_LEFT';
export const MOVE_HIGHLIGHTS_RIGHT = 'MOVE_HIGHLIGHTS_RIGHT';
export const FINISH_VANISHING_ANIMATIONS = 'FINISH_VANISHING_ANIMATIONS';
export const FINISH_DROPPING_ANIMATIONS = 'FINISH_DROPPING_ANIMATIONS';
export const APPLY_GRAVITY = 'APPLY_GRAVITY';
export const VANISH_PUYOS = 'VANISH_PUYOS';
export const UNDO_FIELD = 'UNDO_FIELD';
export const RESET_FIELD = 'RESET_FIELD';
export const RESTART = 'RESTART';
export const SAVE_CONFIG = 'SAVE_CONFIG';

export const putNextPair = (position, rotation) => {
  return {
    type: 'PUT_NEXT_PAIR',
    payload: {
      position,
      rotation
    }
  };
};

export const initializeSimulator = makeActionCreator(INITIALIZE_SIMULATOR);
export const rotateHighlightsLeft = makeActionCreator(ROTATE_HIGHLIGHTS_LEFT);
export const rotateHighlightsRight = makeActionCreator(ROTATE_HIGHLIGHTS_RIGHT);
export const moveHighlightsLeft = makeActionCreator(MOVE_HIGHLIGHTS_LEFT);
export const moveHighlightsRight = makeActionCreator(MOVE_HIGHLIGHTS_RIGHT);
export const finishDroppingAnimations = makeActionCreator(FINISH_DROPPING_ANIMATIONS);
export const finishVanishingAnimations = makeActionCreator(FINISH_VANISHING_ANIMATIONS);
export const applyGravity = makeActionCreator(APPLY_GRAVITY);
export const vanishPuyos = makeActionCreator(VANISH_PUYOS);
export const undoField = makeActionCreator(UNDO_FIELD);
export const resetField = makeActionCreator(RESET_FIELD);
export const restart = makeActionCreator(RESTART);
export const saveConfig = makeActionCreator(SAVE_CONFIG, 'key', 'value');
