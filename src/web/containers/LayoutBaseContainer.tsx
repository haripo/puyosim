import React, { Component } from 'react';
import { View } from "react-native";
import { connect } from "react-redux";
import {
  resetLayout
} from "../../shared/actions/actions";

type Props = {
  onLayout: (_: { width: number, height: number }) => void
}

const mapStateToProps = (state) => {
  return {
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    onLayout: layout => {
      dispatch(resetLayout(layout));
    }
  };
};

class LayoutBaseContainer extends Component<Props, {}> {
  view: View | null = null;

  handleLayout() {
    // e.nativeEvent にアクセスするとなぜかフリーズするので ref.measure を使う
    // FIXME: 原因究明 （onLayout が再帰的に呼ばれている？）
    this.view!.measure((ox, oy, width, height) => {
      this.props.onLayout({ width, height });
    });
  }

  componentDidMount() {
    this.handleLayout();
  }

  render() {
    return (
      <View
        style={{ flex: 1 }}
        ref={ r => this.view = r }>
        { this.props.children }
      </View>
    )
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(LayoutBaseContainer);
