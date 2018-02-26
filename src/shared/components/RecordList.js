/**
 * Component for render next and double-next pairs
 */
import React, { Component } from 'react';
import { FlatList, StyleSheet, Text, View } from 'react-native';
import { cardBackgroundColor, contentsMargin, contentsPadding, puyoSize } from '../utils/constants';
import Puyo from './Puyo';

export default class RecordList extends Component {
  renderPosition(record) {
    const map = {
      'top': '↑',
      'left': '←',
      'right': '→',
      'bottom': '↓'
    };
    return (
      <Text style={ styles.position }>
        { record.move.col + 1 }
        { map[record.move.rotation] }
      </Text>
    )
  }

  renderItem(record, puyoSkin) {
    console.log(record);
    return (
      <View style={ styles.puyos } key={ record.index }>
        <Puyo
          puyo={ record.pair[1] }
          size={ puyoSize }
          skin={ puyoSkin }
          x={ contentsPadding }
          y={ contentsPadding }/>
        <Puyo
          puyo={ record.pair[0] }
          size={ puyoSize }
          skin={ puyoSkin }
          x={ contentsPadding + puyoSize }
          y={ contentsPadding }/>
        { this.renderPosition(record) }
      </View>
    );
  }

  render() {
    const { history, puyoSkin } = this.props;
    const records = history.reverse().map((item, i) => ({ ...item, index: i }));

    return (
      <View style={ styles.component }>
        <FlatList
          data={ records }
          renderItem={ ({ item }) => this.renderItem(item, puyoSkin) }
          keyExtractor={ item => item.index }
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  component: {
    backgroundColor: cardBackgroundColor,
    elevation: 2,
    marginTop: contentsMargin,
    flex: 1
  },
  puyos: {
    height: puyoSize + contentsPadding * 2
  },
  position: {
    position: 'absolute',
    left: puyoSize * 2 + contentsPadding * 2,
    top: contentsPadding,
    lineHeight: puyoSize,
    textAlign: 'center',
    width: puyoSize,
    fontSize: 20
  },
});