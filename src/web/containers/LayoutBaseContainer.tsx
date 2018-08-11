import React, { Component } from 'react';
import { View } from "react-native";
import { connect } from "react-redux";
import {
  resetLayout
} from "../../shared/actions/actions";
import { webToolbarSize } from "../../shared/utils/constants";

type LayoutEvent = {
  nativeEvent: {
    layout: {
      width: number,
      height: number
    }
  }
}

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
