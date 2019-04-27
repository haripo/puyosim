import { connect } from 'react-redux';
import {
  applyGravity,
  finishDroppingAnimations,
  finishVanishingAnimations,
  initializeEditor,
  putCurrentItem,
  selectEditItem,
  vanishPuyos,
} from '../../shared/actions/actions';
import { getStack, getVanishingPuyos, isActive } from '../../shared/selectors/fieldSelectors';
import { getLayout } from '../../shared/selectors/layoutSelectors';
import { getTheme } from '../../shared/selectors/themeSelectors';
import Editor from "../components/Editor";
import { State } from "../../shared/reducers";

const mapStateToProps = (state: State) => {
  return {
    stack: getStack(state.editor),

    droppings: state.editor.droppingPuyos,
    vanishings: getVanishingPuyos(state.editor),
    isActive: isActive(state.editor),

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
    onMounted: () => {
      dispatch(initializeEditor());
    }
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Editor);
