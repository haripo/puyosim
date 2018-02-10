/**
 * Base component
 * @flow
 */

import React, { Component } from 'react';
import { Alert, Linking, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import NextWindowContainer from '../../shared/containers/NextWindowContainer';
import ChainResultContainer from '../../shared/containers/ChainResultContainer';
import { buttonColor, contentsMargin, controllerButtonSize, themeColor, themeLightColor } from '../../shared/utils/constants';
import Field from '../../shared/components/Field';
import Icon from 'react-native-vector-icons/MaterialIcons';
import t from '../../shared/service/i18n';

export default class Simulator extends Component {
  static navigatorButtons = {
    rightButtons: [
      {
        title: t('reset'),
        id: 'reset',
        showAsAction: 'never'
      },
      {
        title: t('undo'),
        id: 'undo',
        showAsAction: 'never'
      }
    ]
  };

  static navigatorStyle = {
    navBarBackgroundColor: themeColor,
    navBarTextColor: themeLightColor,
    navBarButtonColor: themeLightColor
  };

  constructor(props) {
    super(props);
    this.props.navigator.setOnNavigatorEvent(::this.onNavigatorEvent);
    this.props.navigator.setTitle({ title: "puyosim" })
  }

  componentDidMount() {
    this.props.onSimulatorLaunched();
  }

  onNavigatorEvent(event) {
    if (event.type === 'NavBarButtonPress') {
      switch (event.id) {
        case 'undo':
          this.props.onUndoSelected();
          break;
        case 'reset':
          this.props.onResetSelected();
          break;
      }
    }
  }

  render() {
    return (
      <View style={ styles.container }>
        <View style={ styles.contents }>
          <View>
            <Field
              stack={ this.props.stack }
              ghosts={ this.props.ghosts }
              droppingPuyos={ this.props.droppingPuyos }
              vanishingPuyos={ this.props.vanishingPuyos }
              isActive={ this.props.isActive }
              style={ styles.field }
              onDroppingAnimationFinished={ this.props.onDroppingAnimationFinished }
              onVanishingAnimationFinished={ this.props.onVanishingAnimationFinished }
              onSwiping={ this.props.onSwiping }
              onSwipeEnd={ this.props.onSwipeEnd }>
            </Field>
          </View>
          <View style={ styles.side }>
            <View style={ styles.sideHead }>
              <NextWindowContainer />
              <ChainResultContainer />
            </View>
            <View style={{ flexDirection: 'column' }}>
              <View style={ styles.buttonGroup }>
                <TouchableOpacity
                  style={ styles.controllerFullWidthButton }
                  onPress={ this.props.onUndoSelected }>
                  <Icon name="undo" size={30} color="#FFF" />
                  <Text style={{ color: '#FFF' }}>Undo</Text>
                </TouchableOpacity>
              </View>
              <View style={styles.buttons}>
                <View style={ styles.buttonGroup }>
                  <TouchableOpacity
                    style={ styles.controllerButton }
                    onPress={ this.props.onNextPressed }
                    disabled={ !this.props.isActive }>
                    <Icon name="arrow-back" size={30} color="#FFF" />
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={ styles.controllerButton }
                    onPress={ this.props.onPrevPressed }
                    disabled={ !this.props.isActive }>
                    <Icon name="arrow-forward" size={30} color="#FFF" />
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </View>
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
    justifyContent: 'center',
    alignItems: 'stretch',
    flexDirection: 'row'
  },
  side: {
    flex: 1,
    justifyContent: 'space-between',
    marginTop: contentsMargin,
    marginRight: contentsMargin,
    marginBottom: contentsMargin
  },
  sideHead: {
    flex: 1
  },
  buttons: {
  },
  buttonGroup: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  controllerButton: {
    width: controllerButtonSize,
    height: controllerButtonSize,
    marginTop: contentsMargin,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: buttonColor,
    borderRadius: 3,
    elevation: 3,
  },
  controllerFullWidthButton: {
    backgroundColor: buttonColor,
    width: controllerButtonSize * 2 + contentsMargin,
    height: controllerButtonSize,
    marginTop: contentsMargin,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 3,
    elevation: 3,
  },
  controllerButtonImage: {
    width: '25%',
    height: '25%',
    resizeMode: 'contain'
  },
  field: {
    margin: contentsMargin
  }
});
