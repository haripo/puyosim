import { connect } from 'react-redux';
import { archiveCurrentField, editArchive, openTwitterShare, resetField, restart } from '../../shared/actions/actions';
import { getTheme } from "../../shared/selectors/themeSelectors";
import RightDrawer from "../components/RightDrawer";

const mapStateToProps = (state) => {
  return {
    theme: getTheme(state.theme)
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    onResetSelected: () => {
      dispatch(resetField());
    },
    onRestartSelected: () => {
      dispatch(restart());
    },
    onShareSelected: () => {
      dispatch(openTwitterShare());
    },
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(RightDrawer);
