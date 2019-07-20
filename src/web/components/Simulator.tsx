import React, { Component } from 'react';
import { StyleSheet, View } from 'react-native';
import { parse } from 'query-string';
import Modal from 'react-modal';
import { HotKeys } from 'react-hotkeys';

import { PendingPair, PendingPairPuyo, StackForRendering } from "../../types";
import { HistoryRecord } from "../../shared/models/history";
import { DroppingPlan, VanishingPlan } from "../../shared/models/chainPlanner";
import { Layout } from "../../shared/selectors/layoutSelectors";
import { Theme } from "../../shared/selectors/themeSelectors";
import { contentsMargin, contentsPadding } from '../../shared/utils/constants';
import NextWindowContainer from '../../shared/containers/NextWindowContainer';
import Field from '../../shared/components/Field';
import HandlingPuyos from '../../shared/components/HandlingPuyos';
import SimulatorControls from '../../shared/components/SimulatorControls';
import HistoryTree from '../../shared/components/HistoryTree/HistoryTree';
import ViewerControls from "../../shared/components/ViewerControls";
import ShareModalContainer from "../containers/ShareModalContainer";
import ChainResult from "../../shared/components/ChainResult";
import IconButton from "../../shared/components/IconButton";

// TODO: https://github.com/vitalets/react-native-extended-stylesheet
// import MediaQuery from "react-native-web-responsive";

// @ts-ignore
const rootElement = document.getElementById('root');

export type Props = {
  match: any,
  location: any,

  stack: StackForRendering,
  ghosts: PendingPairPuyo[],
  pendingPair: PendingPair,
  droppings: DroppingPlan[],
  vanishings: VanishingPlan[],

  score: number,
  chainScore: number,
  chain: number,

  puyoSkin: string,
  layout: Layout,
  theme: Theme,

  mode: string | undefined,
  isActive: boolean,
  canUndo: boolean,
  canRedo: boolean,

  onUndoSelected: () => void,
  onRedoSelected: () => void,
  onResetSelected: () => void,
  onRestartSelected: () => void,
  onShareSelected: () => void,
  onRotateLeftPressed: () => void,
  onRotateRightPressed: () => void,
  onMoveLeftPressed: () => void,
  onMoveRightPressed: () => void,
  onDropPressed: () => void,
  onDroppingAnimationFinished: () => void,
  onVanishingAnimationFinished: () => void,

  history: HistoryRecord[],
  historyIndex: number,
  historyTreeLayout: any,
  onHistoryNodePressed: (index: number) => void,
  onReconstructHistoryRequested: (history: string, queue: string, index: number) => void,
}

type State = {
  shareModalIsOpen: boolean
}

export default class Simulator extends Component<Props, State> {
  hotkeyElementRef: any;

  constructor(props) {
    super(props);
    this.state = {
      shareModalIsOpen: false
    }
  }

  componentDidMount() {
    // enable hotkeys
    if (this.hotkeyElementRef) {
      this.hotkeyElementRef.focus();
    }

    const query = parse(this.props.location.search);
    if ('q' in query && 'h' in query) {
      // FIXME: type conversions
      this.props.onReconstructHistoryRequested(
        query['h'] as string,
        query['q'] as string,
        'i' in query ? parseInt(query['i'] as string) : 0,
      )
    }
  }

  handleSharePressed() {
    this.setState({
      shareModalIsOpen: true
    });
  }

  handleRequestShareModalClose() {
    this.setState({
      shareModalIsOpen: false
    })
  }

  renderControls(keyMap: any) {
    if (this.props.mode !== 'view') {
      return (
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
      );
    } else {
      return (
        <ViewerControls
          onUndoSelected={ this.props.onUndoSelected }
          onRedoSelected={ this.props.onRedoSelected }
          isActive={ this.props.isActive }
          canUndo={ this.props.canUndo }
          canRedo={ this.props.canRedo }
          shortcuts={ keyMap }
        />
      );
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

    const handleKey = handler => {
      return () => {
        if (this.props.isActive) {
          handler()
        }
      }
    };

    const keyHandlers = {
      'moveLeft': handleKey(this.props.onMoveLeftPressed),
      'moveRight': handleKey(this.props.onMoveRightPressed),
      'putHand': handleKey(this.props.onDropPressed),
      'rotateRight': handleKey(this.props.onRotateRightPressed),
      'rotateLeft': handleKey(this.props.onRotateLeftPressed),
      'undo': handleKey(this.props.onUndoSelected),
      'redo': handleKey(this.props.onRedoSelected)
    };

    return (
      <HotKeys
        keyMap={ keyMap }
        handlers={ keyHandlers }
        style={ { display: 'flex', alignItems: 'stretch', flexGrow: 1 } }
        focused>
        { /* Focused on mounted to enable hotkeys */ }
        <View
          style={ {
            marginTop: contentsMargin,
            marginLeft: contentsMargin,
            marginBottom: contentsMargin
          } }
          ref={ c => this.hotkeyElementRef = c }>
          <HandlingPuyos
            pair={ this.props.pendingPair }
            puyoSkin={ this.props.puyoSkin }
            layout={ this.props.layout }
            style={ { marginBottom: contentsPadding } }>
          </HandlingPuyos>
          <Field
            stack={ this.props.stack }
            ghosts={ this.props.ghosts }
            droppings={ this.props.droppings }
            vanishings={ this.props.vanishings }
            isActive={ this.props.isActive }
            style={ {} }
            theme={ this.props.theme }
            layout={ this.props.layout }
            puyoSkin={ this.props.puyoSkin }
            onDroppingAnimationFinished={ this.props.onDroppingAnimationFinished }
            onVanishingAnimationFinished={ this.props.onVanishingAnimationFinished }
          />
        </View>
        <View style={ styles.side }>
          <View>
            <NextWindowContainer/>
            <ChainResult
              score={ this.props.score }
              chain={ this.props.chain }
              chainScore={ this.props.chainScore }
            />
          </View>
          <View style={ {
            display: 'flex',
            flexDirection: 'row'
          } }>
            { this.renderControls(keyMap) }
            <View style={ styles.buttons }>
              <View style={ styles.buttonGroup }>
                <IconButton
                  icon='fast-rewind'
                  text='reset'
                  onPressed={ this.props.onResetSelected.bind(this) }
                />
                <IconButton
                  style={ styles.controllerRightButton }
                  icon='delete'
                  text='restart'
                  onPressed={ this.props.onRestartSelected.bind(this) }
                />
              </View>
              {/*<View style={ styles.buttonGroup }>*/}
              {/*  <IconButton*/}
              {/*    icon='cloud-upload'*/}
              {/*    text='save'*/}
              {/*    onPressed={ notImplementedAlert }*/}
              {/*  />*/}
              {/*  <IconButton*/}
              {/*    style={ styles.controllerRightButton }*/}
              {/*    icon='cloud-download'*/}
              {/*    text='load'*/}
              {/*    onPressed={ notImplementedAlert }*/}
              {/*  />*/}
              {/*</View>*/}
              <View style={ styles.buttonGroup }>
                <IconButton
                  icon='share'
                  text='share'
                  onPressed={ this.handleSharePressed.bind(this) }
                />
              </View>
            </View>
          </View>
        </View>
        <View>
          <HistoryTree
            historyTreeLayout={ this.props.historyTreeLayout }
            onNodePressed={ this.props.onHistoryNodePressed }
          />
        </View>
        <Modal
          isOpen={ this.state.shareModalIsOpen }
          shouldCloseOnEsc={ true }
          shouldReturnFocusAfterClose={ true }
          onRequestClose={ this.handleRequestShareModalClose.bind(this) }
          style={ modalStyles }
          appElement={ rootElement }
        >
          <ShareModalContainer/>
        </Modal>
      </HotKeys>
    );
  }
}

const modalStyles = {
  content: {
    top: '50%',
    left: '50%',
    right: 'auto',
    bottom: 'auto',
    marginRight: '-50%',
    transform: 'translate(-50%, -50%)'
  }
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#F5F5F5',
    display: 'flex',
    flexDirection: 'row',
    height: '100%'
  },
  side: {
    justifyContent: 'space-between',
    margin: contentsMargin,
    width: 340
  },
  hotkeyElement: {
    borderWidth: 0
  },


  buttons: {
    flex: 1,
    flexDirection: 'column',
    height: 300 / 4 * 2,
    marginLeft: contentsPadding
  },
  buttonGroup: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  controllerRightButton: {
    marginLeft: contentsMargin
  },
});
