import React, { Component } from 'react';
import { StyleSheet, View } from 'react-native';
import NextWindowContainer from '../../shared/containers/NextWindowContainer';
import ChainResultContainer from '../../shared/containers/ChainResultContainer';
import { contentsMargin, simulatorWidth } from '../../shared/utils/constants';
import Field from '../../shared/components/Field';
import HandlingPuyos from '../../shared/components/HandlingPuyos';
import SimulatorControls from '../../shared/components/SimulatorControls';
import HistoryTree from '../../shared/components/HistoryTree/HistoryTree';
import { HotKeys } from 'react-hotkeys';
import WebToolbar from './WebToolbar';
import LayoutBaseContainer from '../containers/LayoutBaseContainer';

export default class Simulator extends Component {
  constructor(props) {
    super(props);
  }

  componentDidMount() {
    // enable hotkeys
    if (this.hotkeyElementRef) {
      this.hotkeyElementRef.focus();
    }
  }

  render() {
    const keyMap = {
      'moveLeft': 'left',
      'moveRight': 'right',
      'putHand': 'down',
      'rotateRight': 'x',
      'rotateLeft': 'z',
      'undo': 'a',
      'redo': 's'
    };

    const keyHandlers = {
      'moveLeft': this.props.onMoveLeftPressed,
      'moveRight': this.props.onMoveRightPressed,
      'putHand': this.props.onDropPressed,
      'rotateRight': this.props.onRotateRightPressed,
      'rotateLeft': this.props.onRotateLeftPressed,
      'undo': this.props.onUndoSelected,
      'redo': this.props.onRedoSelected
    };

    return (
      <HotKeys
        keyMap={ keyMap }
        handlers={ keyHandlers }
        style={ { outline: '0' } }
        focused>
        { /* Focused on mounted to enable hotkeys */ }
        <View
          ref={ c => this.hotkeyElementRef = c }
          tabIndex={ -1 }
          style={ { outline: '0' } }>
          <View>
            <WebToolbar/>
          </View>
          <LayoutBaseContainer>
            <View style={ styles.container }>
              <View style={ styles.contents }>
                <View>
                  <HandlingPuyos
                    pair={ this.props.pendingPair }
                    puyoSkin={ this.props.puyoSkin }
                    layout={ this.props.layout }>
                  </HandlingPuyos>
                  <Field
                    stack={ this.props.stack }
                    ghosts={ this.props.ghosts }
                    isActive={ this.props.isActive }
                    style={ styles.field }
                    theme={ this.props.theme }
                    layout={ this.props.layout }
                    puyoSkin={ this.props.puyoSkin }>
                  </Field>
                </View>
                <View style={ styles.side }>
                  <View style={ styles.sideHead }>
                    <NextWindowContainer/>
                    <ChainResultContainer/>
                  </View>
                  <SimulatorControls
                    onUndoSelected={ this.props.onUndoSelected }
                    onRedoSelected={ this.props.onRedoSelected }
                    onRotateLeftPressed={ this.props.onRotateLeftPressed }
                    onRotateRightPressed={ this.props.onRotateRightPressed }
                    onMoveLeftPressed={ this.props.onMoveLeftPressed }
                    onMoveRightPressed={ this.props.onMoveRightPressed }
                    onDropPressed={ this.props.onDropPressed }
                    isActive={ this.props.isActive }
                    canUndo={ this.props.canUndo }
                    canRedo={ this.props.canRedo }
                    shortcuts={ keyMap }
                  />
                </View>
              </View>
              <View style={ styles.historyTree }>
                <HistoryTree
                  history={ this.props.history }
                  historyTreeLayout={ this.props.historyTreeLayout }
                  currentIndex={ this.props.historyIndex }
                  onNodePressed={ this.props.onHistoryNodePressed }
                />
              </View>
            </View>
          </LayoutBaseContainer>
        </View>
      </HotKeys>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#F5F5F5',
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    outline: '0'
  },
  contents: {
    display: 'flex',
    flexDirection: 'row',
    width: simulatorWidth - contentsMargin,
    outline: '0'
  },
  side: {
    flex: 1,
    justifyContent: 'space-between',
    marginRight: contentsMargin,
    marginLeft: contentsMargin,
    marginBottom: contentsMargin
  },
  sideHead: {
    flex: 1
  },
  historyTree: {},
  hotkeyElement: {
    borderWidth: 0
  }
});
