import { connect } from 'react-redux';
import {
  applyGravityEditor,
  finishDroppingAnimationsEditor,
  finishVanishingAnimationsEditor, initializeEditor,
  putCurrentItem,
  selectEditItem,
  vanishPuyosEditor,
} from '../../shared/actions/actions';
import { getStackForEditor, getVanishingPuyos } from '../../shared/selectors/simulatorSelectors';
import { getLayout } from '../../shared/selectors/layoutSelectors';
import { getTheme } from '../../shared/selectors/themeSelectors';
import Editor from "../components/Editor";

export function isActive(state): boolean {
  return !(
    state.editor.droppingPuyos.length > 0 ||
    state.editor.vanishingPuyos.length > 0
  );
}

const mapStateToProps = (state) => {
  return {
    stack: getStackForEditor(state.editor),

    droppings: state.editor.droppingPuyos,
    vanishings: getVanishingPuyos(state.editor),
    isActive: isActive(state),

    currentItem: state.editor.currentItem,

    puyoSkin: state.config.puyoSkin as string,
    layout: getLayout(state.layout),
    theme: getTheme(state.theme)
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    onVanishingAnimationFinished: () => {
      dispatch(finishVanishingAnimationsEditor());
      dispatch(applyGravityEditor());
    },
    onDroppingAnimationFinished: () => {
      dispatch(finishDroppingAnimationsEditor());
      dispatch(vanishPuyosEditor());
    },
    onEditItemSelected: (item) => {
      dispatch(selectEditItem(item))
    },
    onFieldTouched : (row, col) => {
      dispatch(putCurrentItem({ row, col }));
    },
    onPlaySelected: () => {
      dispatch(applyGravityEditor());
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
