import { connect } from 'react-redux';
import {
} from '../actions/actions';
import SettingsPage from '../components/SettingsPage';
import toJS from '../utils/toJS';

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
)(toJS(SettingsPage));
