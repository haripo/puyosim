import React from 'react';
import Puyo from './Puyo';
import { ViewStyle } from "react-native";

/**
 * Component for render single puyo
 */
export default class GhostPuyo extends Puyo {
  style(): ViewStyle {
    return {
      ...super.style(),
      opacity: 0.2
    };
  }
}
