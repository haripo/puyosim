import React, { Component } from "react";
import { ActivityIndicator, StyleSheet, View } from "react-native";
import { Theme } from "../selectors/themeSelectors";

export type Props = {
  isLoading: boolean,
  theme: Theme
  children: any
}

export default class Loading extends Component<Props, {}> {
  renderIndicator() {
    return (
      <View style={ styles.container }>
        <ActivityIndicator size="small" color={ this.props.theme.themeColor } />
      </View>
    );
  }

  render() {
    return (
      <View style={{ flex: 1 }}>
        { this.props.isLoading ? this.renderIndicator() : this.props.children }
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