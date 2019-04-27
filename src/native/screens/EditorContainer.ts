import { connect } from 'react-redux';
import {
  applyGravity,
  finishDroppingAnimations,
  finishVanishingAnimations, putCurrentItem,
  selectEditItem,
  vanishPuyos,
} from '../../shared/actions/actions';
import { getStackForEditor, getVanishingPuyos, isActive } from '../../shared/selectors/simulatorSelectors';
import { getLayout } from '../../shared/selectors/layoutSelectors';
import { getTheme } from '../../shared/selectors/themeSelectors';
import Editor from "../components/Editor";

const mapStateToProps = (state) => {
  return {
    stack: getStackForEditor(state.editor),

    droppings: state.simulator.droppingPuyos,
    vanishings: getVanishingPuyos(state.simulator),
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
      dispatch(finishVanishingAnimations());
      dispatch(applyGravity());
    },
    onDroppingAnimationFinished: () => {
      dispatch(finishDroppingAnimations());
      dispatch(vanishPuyos());
    },
    onEditItemSelected: (item) => {
      dispatch(selectEditItem(item))
    },
    onFieldTouched : (row, col) => {
      dispatch(putCurrentItem({ row, col }));
    }
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Editor);
