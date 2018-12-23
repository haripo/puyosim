import { connect } from 'react-redux';
import { archiveCurrentField, editArchive } from '../../shared/actions/actions';
import SaveModal from "../components/SaveModal";
import { getStack } from "../../shared/selectors/simulatorSelectors";
import { getLayout } from "../../shared/selectors/layoutSelectors";
import { getTheme } from "../../shared/selectors/themeSelectors";
import { ArchivedPlay } from "../../shared/utils/StorageService.native";

const mapStateToProps = (state) => {
  return {
    stack: getStack(state.simulator),
    puyoSkin: state.config.puyoSkin as string,
    layout: getLayout(state.layout),
    theme: getTheme(state.theme)
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    onSavePressed: (play: ArchivedPlay) => {
      if (play.id) {
        dispatch(editArchive(play));
      } else {
        dispatch(archiveCurrentField(play.title));
      }
    },
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(SaveModal);
