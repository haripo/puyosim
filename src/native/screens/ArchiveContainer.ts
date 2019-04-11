import { connect } from 'react-redux';
import ArchiveList from '../components/ArchiveList';
import { getLayoutForArchivedListField } from "../../shared/selectors/layoutSelectors";
import { getTheme } from "../../shared/selectors/themeSelectors";
import { State } from "../../shared/reducers";
import {
  deleteArchive,
  loadArchive,
  loadArchiveListFirstPage,
  loadArchiveListNextPage,
  requestLogin
} from "../../shared/actions/actions";
import { getArchives } from "../../shared/selectors/archiveSelectors";

const mapStateToProps = (state: State) => {
  return {
    puyoSkin: state.config.puyoSkin,
    layout: getLayoutForArchivedListField(),
    theme: getTheme(state.theme),

    archives: getArchives(state.archive)
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    onArchiveOpened() {
      dispatch(loadArchiveListFirstPage());
    },
    onItemPressed(id: string) {
      dispatch(loadArchive(id));
    },
    onEndReached() {
      dispatch(loadArchiveListNextPage());
    },
    onDeleteSelected(id: string) {
      dispatch(deleteArchive(id))
    },
    onLoginRequested() {
      dispatch(requestLogin());
    }
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ArchiveList);
