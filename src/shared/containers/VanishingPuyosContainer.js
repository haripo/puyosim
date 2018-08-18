import { connect } from 'react-redux';
import { applyGravity, finishVanishingAnimations } from '../actions/actions';
import VanishingPuyos from '../components/VanishingPuyos';
import { getVanishingPuyos } from '../selectors/simulatorSelectors';
import { getLayout } from '../selectors/layoutSelectors';

const mapStateToProps = (state) => {
  return {
    vanishings: getVanishingPuyos(state.simulator),
    puyoSkin: state.config.puyoSkin,
    layout: getLayout(state.layout)
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    onVanishingAnimationFinished: () => {
      dispatch(finishVanishingAnimations());
      dispatch(applyGravity());
    }
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(VanishingPuyos);
