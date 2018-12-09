import { connect } from 'react-redux';
import { archiveCurrentField, editArchive } from '../../shared/actions/actions';
import { getTheme } from "../../shared/selectors/themeSelectors";
import RightDrawer from "../components/RightDrawer";

const mapStateToProps = (state) => {
  return {
    theme: getTheme(state.theme)
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(RightDrawer);
