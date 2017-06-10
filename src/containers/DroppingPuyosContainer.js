import { connect } from 'react-redux';
import { finishDroppingAnimations, vanishPuyos } from '../actions/actions';
import DroppingPuyos from '../components/DroppingPuyos';
import toJS from '../utils/toJS';

const mapStateToProps = (state) => {
  const simulator = state.simulator;
  return {
    droppings: simulator.get('droppingPuyos')
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    onDroppingAnimationFinished: () => {
      dispatch(finishDroppingAnimations());
      dispatch(vanishPuyos());
    }
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(toJS(DroppingPuyos));
