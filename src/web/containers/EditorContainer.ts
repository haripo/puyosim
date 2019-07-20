import { connect } from 'react-redux';
import {
  applyEditorState,
  applyGravity,
  finishDroppingAnimations,
  finishVanishingAnimations, initializeEditor,
  putCurrentItem,
  resetEditorField,
  runChainAnimation,
  selectEditItem,
  undoEditorField,
  vanishPuyos,
} from '../../shared/actions/actions';
import { getPendingPair, } from '../../shared/selectors/simulatorSelectors';
import { getStack, getVanishingPuyos, isActive } from '../../shared/selectors/fieldSelectors';
import { getLayout } from '../../shared/selectors/layoutSelectors';
import { getTheme } from '../../shared/selectors/themeSelectors';
import { State } from "../../shared/reducers";
import Editor from '../components/Editor';

const mapStateToProps = (state: State) => {
  return {
    stack: getStack(state.editor),
    pendingPair: getPendingPair(state.simulator),
    droppings: state.editor.droppingPuyos,
    vanishings: getVanishingPuyos(state.editor),

    score: state.editor.score,
    chainScore: state.editor.chainScore,
    chain: state.editor.chain,

    puyoSkin: state.config.puyoSkin,
    layout: getLayout(state.layout),
    theme: getTheme(state.theme),

    isActive: isActive(state.editor),

    currentItem: state.editor.currentItem
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    onEditorMounted: () => {
      dispatch(initializeEditor());
    },
    onEditorUnMounted: () => {
      dispatch(applyEditorState());
    },
    onUndoSelected: () => {
      dispatch(undoEditorField());
    },
    onResetSelected: () => {
      dispatch(resetEditorField());
    },
    onPlaySelected: () => {
      dispatch(runChainAnimation('editor'));
    },
    onEditItemSelected: (item) => {
      dispatch(selectEditItem(item))
    },
    onFieldTouched : (row, col) => {
      dispatch(putCurrentItem({ row, col }));
    },
    onVanishingAnimationFinished: () => {
      dispatch(finishVanishingAnimations('editor'));
      dispatch(applyGravity('editor'));
    },
    onDroppingAnimationFinished: () => {
      dispatch(finishDroppingAnimations('editor'));
      dispatch(vanishPuyos('editor'));
    }
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Editor);
