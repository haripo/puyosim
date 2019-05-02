import { connect } from 'react-redux';
import {
  applyEditorState,
  applyGravity,
  finishDroppingAnimations,
  finishVanishingAnimations,
  initializeEditor,
  putCurrentItem, resetEditorField,
  selectEditItem, undoEditorField,
  vanishPuyos,
} from '../../shared/actions/actions';
import { getStack, getVanishingPuyos, hasDroppingPuyo, isActive } from '../../shared/selectors/fieldSelectors';
import { getLayout } from '../../shared/selectors/layoutSelectors';
import { getTheme } from '../../shared/selectors/themeSelectors';
import Editor from "../components/Editor";
import { State } from "../../shared/reducers";
import { getPendingPair } from "../../shared/selectors/simulatorSelectors";

const mapStateToProps = (state: State) => {
  return {
    stack: getStack(state.editor),
    pendingPair: getPendingPair(state.simulator),

    droppings: state.editor.droppingPuyos,
    vanishings: getVanishingPuyos(state.editor),
    isActive: isActive(state.editor),
    hasDroppingPuyo: hasDroppingPuyo(state.editor),

    currentItem: state.editor.currentItem,

    puyoSkin: state.config.puyoSkin as string,
    layout: getLayout(state.layout),
    theme: getTheme(state.theme)
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    onVanishingAnimationFinished: () => {
      dispatch(finishVanishingAnimations('editor'));
      dispatch(applyGravity('editor'));
    },
    onDroppingAnimationFinished: () => {
      dispatch(finishDroppingAnimations('editor'));
      dispatch(vanishPuyos('editor'));
    },
    onEditItemSelected: (item) => {
      dispatch(selectEditItem(item))
    },
    onFieldTouched : (row, col) => {
      dispatch(putCurrentItem({ row, col }));
    },
    onPlaySelected: () => {
      dispatch(applyGravity('editor'));
    },
    onUndoSelected: () => {
      dispatch(undoEditorField());
    },
    onResetSelected: () => {
      dispatch(resetEditorField());
    },
    onMounted: () => {
      dispatch(initializeEditor());
    },
    onScreenBlur: () => {
      dispatch(applyEditorState());
    }
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Editor);
