import { connect } from 'react-redux';
import { State } from "../../shared/reducers";
import Main from "../components/Main";

const mapStateToProps = (state: State) => {
  return {
  }
};

const mapDispatchToProps = (dispatch) => {
  return {
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Main);
