import { connect } from 'react-redux';
import AboutContent from '../components/AboutContents';
import toJS from '../../shared/utils/toJS';

const mapStateToProps = (state) => {
  return {
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(toJS(AboutContent));
