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
export const REDO_FIELD = 'REDO_FIELD';
export const MOVE_HISTORY = 'MOVE_HISTORY';
export const RESET_FIELD = 'RESET_FIELD';
export const RESTART = 'RESTART';
export const RECONSTRUCT_HISTORY = 'RECONSTRUCT_HISTORY';
export const SAVE_CONFIG = 'SAVE_CONFIG';
export const OPEN_TWITTER_SHARE = 'OPEN_TWITTER_SHARE';
export const RESET_LAYOUT = 'RESET_LAYOUT';
export const ARCHIVE_CURRENT_FIELD = 'ARCHIVE_CURRENT_FIELD';
export const LOAD_ARCHIVES_LIST_FIRST_PAGE = 'LOAD_ARCHIVES_LIST_FIRST_PAGE';
export const LOAD_ARCHIVES_LIST_NEXT_PAGE = 'LOAD_ARCHIVES_LIST_NEXT_PAGE';
export const LOAD_ARCHIVE = 'LOAD_ARCHIVE';
export const LOAD_ARCHIVE_FINISHED = 'LOAD_ARCHIVE_FINISHED';
export const DEBUG_SET_PATTERN = 'DEBUG_SET_PATTERN';
export const DEBUG_SET_HISTORY = 'DEBUG_SET_HISTORY';

export const putNextPair = makeActionCreator(PUT_NEXT_PAIR);
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
export const redoField = makeActionCreator(REDO_FIELD);
export const moveHistory = makeActionCreator(MOVE_HISTORY, 'index');
export const resetField = makeActionCreator(RESET_FIELD);
export const restart = makeActionCreator(RESTART);
export const reconstructHistory = makeActionCreator(RECONSTRUCT_HISTORY, 'history', 'queue', 'index');
export const saveConfig = makeActionCreator(SAVE_CONFIG, 'key', 'value');
export const openTwitterShare = makeActionCreator(OPEN_TWITTER_SHARE);
export const resetLayout = makeActionCreator(RESET_LAYOUT, 'layout');
export const archiveCurrentField = makeActionCreator(ARCHIVE_CURRENT_FIELD, 'title');
export const loadArchivesListFirstPage = makeActionCreator(LOAD_ARCHIVES_LIST_FIRST_PAGE, 'start', 'count');
export const loadArchivesListNextPage = makeActionCreator(LOAD_ARCHIVES_LIST_NEXT_PAGE);
export const loadArchive = makeActionCreator(LOAD_ARCHIVE, 'id');
export const loadArchiveFinished = makeActionCreator(LOAD_ARCHIVE_FINISHED, 'play');
export const debugSetPattern = makeActionCreator(DEBUG_SET_PATTERN, 'name');
export const debugSetHistory = makeActionCreator(DEBUG_SET_HISTORY, 'name');
