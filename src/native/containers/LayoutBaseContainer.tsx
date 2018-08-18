import React, { Component } from 'react';
import { ActivityIndicator, View, StyleSheet } from "react-native";
import { connect } from "react-redux";
import {
  resetLayout
} from "../../shared/actions/actions";
import { getTheme, Theme } from "../../shared/selectors/themeSelectors";

type LayoutEvent = {
  nativeEvent: {
    layout: {
      width: number,
      height: number
    }
  }
}

type Props = {
  theme: Theme,
  onLayout: (_: { width: number, height: number }) => void
}

type State = {
  loading: boolean
}

const mapStateToProps = (state) => {
  return {
    theme: getTheme(state.theme)
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    onLayout: layout => {
      dispatch(resetLayout(layout));
    }
  };
};

class LayoutBaseContainer extends Component<Props, State> {
  view: View | null = null;

  constructor(props) {
    super(props);
    this.state = {
      loading: true
    }
  }

  handleLayout(e: LayoutEvent) {
    // e.nativeEvent にアクセスするとなぜかフリーズするので ref.measure を使う
    this.view!.measure((ox, oy, width, height) => {
      this.props.onLayout({ width, height });
      this.setState({ loading: false });
    });
  }

  renderIndicator() {
    return (
      <View style={ styles.container }>
        <ActivityIndicator size="small" color={ this.props.theme.themeColor } />
      </View>
    );
  }

  render() {
    return (
      <View
        style={{ flex: 1 }}
        onLayout={ this.handleLayout.bind(this) }
        ref={ r => this.view = r }>
        { this.state.loading ? this.renderIndicator() : this.props.children }
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center'
  },
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(LayoutBaseContainer);
