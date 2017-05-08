import React from 'react';
import Puyo from './Puyo';

/**
 * Component for render single puyo
 */
export default class GhostPuyo extends Puyo {
  style() {
    return [
      super.style(),
      { opacity: 0.2 }
    ];
  }
}
