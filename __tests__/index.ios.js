import React from 'react';
import 'react-native';
// Note: test renderer must be required after react-native.
import renderer from 'react-test-renderer';
import Index from '../index.ios.js';

it('renders correctly', () => {
  const tree = renderer.create(
    <Index />
  );
});
