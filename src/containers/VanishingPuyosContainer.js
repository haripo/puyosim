import { connect } from 'react-redux';
import VanishingPuyos from '../components/VanishingPuyos';
import toJS from '../utils/toJS';
import { finishVanishingAnimations } from '../actions/actions';
import { applyGravity } from '../actions/actions';

const mapStateToProps = (state) => {
  const simulator = state.simulator;
  return {
    vanishings: simulator.get('vanishingPuyos'),
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    onVanishingAnimationFinished: () => {
      dispatch(finishVanishingAnimations());
      dispatch(applyGravity());
    }
  }
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(toJS(VanishingPuyos));
