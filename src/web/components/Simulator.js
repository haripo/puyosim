import React, { Component } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import NextWindowContainer from '../../shared/containers/NextWindowContainer';
import ChainResultContainer from '../../shared/containers/ChainResultContainer';
import { buttonColor, contentsMargin, contentsWidth, controllerButtonSize } from '../../shared/utils/constants';
import Field from '../../shared/components/Field';
import HandlingPuyos from '../../shared/components/HandlingPuyos';
import Icon from 'react-native-vector-icons/MaterialIcons';

export default class Simulator extends Component {
  constructor(props) {
    super(props);
  }

  componentDidMount() {
  }

  render() {
    return (
      <View style={ styles.container }>
        <View style={ styles.contents }>
          <View>
            <HandlingPuyos
              pair={ this.props.pendingPair }
              puyoSkin={ this.props.puyoSkin }>
            </HandlingPuyos>
            <Field
              stack={ this.props.stack }
              ghosts={ this.props.ghosts }
              droppingPuyos={ this.props.droppingPuyos }
              vanishingPuyos={ this.props.vanishingPuyos }
              isActive={ this.props.isActive }
              style={ styles.field }
              puyoSkin={ this.props.puyoSkin }
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
              <View style={ styles.buttonGroup }>
                <TouchableOpacity
                  style={ styles.controllerButton }
                  onPress={ this.props.onRotateLeftPressed }
                  disabled={ !this.props.isActive }>
                  <Icon name="rotate-left" size={30} color="#FFF" />
                </TouchableOpacity>
                <TouchableOpacity
                  style={ styles.controllerButton }
                  onPress={ this.props.onRotateRightPressed }
                  disabled={ !this.props.isActive }>
                  <Icon name="rotate-right" size={30} color="#FFF" />
                </TouchableOpacity>
              </View>
              <View style={styles.buttons}>
                <View style={ styles.buttonGroup }>
                  <TouchableOpacity
                    style={ styles.controllerButton }
                    onPress={ this.props.onMoveLeftPressed }
                    disabled={ !this.props.isActive }>
                    <Icon name="arrow-back" size={30} color="#FFF" />
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={ styles.controllerButton }
                    onPress={ this.props.onMoveRightPressed }
                    disabled={ !this.props.isActive }>
                    <Icon name="arrow-forward" size={30} color="#FFF" />
                  </TouchableOpacity>
                </View>
                <TouchableOpacity
                  style={ styles.controllerFullWidthButton }
                  onPress={ this.props.onDropPressed }
                  disabled={ !this.props.isActive }>
                  <Icon name="arrow-downward" size={30} color="#FFF" />
                </TouchableOpacity>
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
    backgroundColor: '#F5F5F5',
    width: contentsWidth
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
