import { Iterable } from 'immutable';
import React from 'react';

export default (WrappedComponent) => {
  const component = (wrappedComponentProps) => {
    const KEY = 0;
    const VALUE = 1;

    const propsJS = Object.entries(wrappedComponentProps)
      .reduce((newProps, wrappedComponentProp) => {
        newProps[wrappedComponentProp[KEY]] =
          Iterable.isIterable(wrappedComponentProp[VALUE])
            ? wrappedComponentProp[VALUE].toJS()
            : wrappedComponentProp[VALUE];
        return newProps;
      }, {});

    return <WrappedComponent {...propsJS} />;
  };

  // copy static members
  const ignoreKeys = ['length', 'name', 'arguments', 'caller', 'prototype'];
  for (let key of Object.getOwnPropertyNames(WrappedComponent)) {
    if (!ignoreKeys.find(k => k === key)) {
      component[key] = WrappedComponent[key];
    }
  }

  return component;
};