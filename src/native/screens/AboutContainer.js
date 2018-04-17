import { connect } from 'react-redux';
import AboutContent from '../components/AboutContents';
import toJS from '../../shared/utils/toJS';
import { debugSetKenny } from '../../shared/actions/actions';

const mapStateToProps = (state) => {
  return {
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    onSetKennySelected: () => {
      dispatch(debugSetKenny());
    }
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(toJS(AboutContent));
