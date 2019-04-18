import { Layout } from "../../shared/selectors/layoutSelectors";
import { Theme } from "../../shared/selectors/themeSelectors";
import { Component } from "react";
import { StyleSheet, View } from "react-native";
import Field from "../../shared/components/Field";
import React from "react";
import { contentsMargin, themeLightColor } from "../../shared/utils/constants";
import { PendingPair } from "../../shared/selectors/simulatorSelectors";
import { CaptureOptions, captureRef } from "react-native-view-shot";
import { StackForRendering } from "../../shared/models/stack";

export type Props = {
  puyoSkin: string,
  layout: Layout,
  layoutForCapturingField: Layout,
  theme: Theme,
  stack: StackForRendering,
  ghosts: PendingPair
}

type State = {}

export default class FieldCapturer extends Component<Props, State> {

  viewShotRef: any = null;

  async capture() {
    const captureOptions: CaptureOptions = {
      format: 'png',
      result: 'data-uri'
    };
    return await captureRef(this.viewShotRef, captureOptions);
  }

  render() {
    const captureViewStyle = {
      left: this.props.layout.screen.width * 2, // off-screen
      width: this.props.layoutForCapturingField.field.width,
      height: this.props.layoutForCapturingField.field.height
    };

    return (
      <View style={ { position: 'absolute', width: 0, height: 0 } }>
        <View ref={ r => this.viewShotRef = r }
              collapsable={ false }
              style={ captureViewStyle }>
          <Field
            layout={ this.props.layoutForCapturingField }
            theme={ this.props.theme }
            puyoSkin={ this.props.puyoSkin }
            stack={ this.props.stack }
            ghosts={ this.props.ghosts }
            style={ null }
            isActive={ true } // must be true to render ghost puyos
          />
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'stretch',
    backgroundColor: '#F5F5F5'
  },
  contents: {
    flex: 1,
    flexDirection: 'column',
  },
  shareCard: {
    margin: contentsMargin,
    paddingLeft: 18,
    paddingRight: 18,
    paddingTop: 18,
    paddingBottom: 8,
    backgroundColor: themeLightColor
  },
  title: {
    marginBottom: 6,
    fontSize: 14,
    fontWeight: "bold"
  },
  image: {
    width: 80,
    height: 80,
    marginLeft: 20
  },
  description: {
    flexDirection: 'row'
  }
});
