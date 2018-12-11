import React, { Component } from 'react';
import { Platform, StyleSheet, Text, View } from 'react-native';
import SimulatorControls from "../../shared/components/SimulatorControls";
import { contentsMargin, contentsPadding } from "../../shared/utils/constants";
import IconButton from "../../shared/components/IconButton";

export type Props = {
  componentId: string,
}

type State = {
}

export default class RightDrawer extends Component<Props, State> {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <View style={ [styles.container, Platform.OS === 'ios' ? { width: 200 } : null] }>
        <Text>
          hoge
        </Text>
        <View style={ styles.buttons }>
          <View style={ styles.buttonGroup }>
            <IconButton
              icon='history'
              text='history'
              onPressed={ () => {} }
            />
            <IconButton
              style={ styles.controllerRightButton }
              icon='fast-rewind'
              text='reset'
              onPressed={ () => {} }
            />
          </View>
          <View style={ styles.buttonGroup }>
            <IconButton
              icon='delete'
              text='restart'
              onPressed={ () => {} }
            />
            <IconButton
              style={ styles.controllerRightButton }
              icon='share'
              text='share'
              onPressed={ () => {} }
            />
          </View>
          <View style={ styles.buttonGroup }>
            <IconButton
              icon='archive'
              text='save'
              onPressed={ () => {} }
            />
            <IconButton
              style={ styles.controllerRightButton }
              icon='unarchive'
              text='load'
              onPressed={ () => {} }
            />
          </View>
          <View style={ styles.buttonGroup }>
            <IconButton
              icon='settings'
              text='settings'
              onPressed={ () => {} }
            />
            <IconButton
              style={ styles.controllerRightButton }
              icon='feedback'
              text='about'
              onPressed={ () => {} }
            />
          </View>
        </View>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'white',
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
    alignItems: 'stretch',
    padding: contentsPadding
  },
  buttons: {
    flexDirection: 'column',
    height: 300 // SimulatorControls の component.height の半分
  },
  buttonGroup: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  controllerRightButton: {
    marginLeft: contentsMargin
  }
});