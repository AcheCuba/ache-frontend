import React, { useState } from 'react';
import { TouchableWithoutFeedback, Text, View } from 'react-native';
import NeuView from './NeuView';
//import PropTypes from 'prop-types';

const NeuButton = props => {
  const [toggleEffect, setToggleEffect] = useState(false);
  const {
    children,
    isConvex,
    active,
    noPressEffect,
    onPressIn,
    onPressOut,
    onPress,
    onLongPress,
    accessibilityRole,
    accessibilityStates,
    accessibilityLabel,
    testID
  } = props;

  const pressOut = () => {
    if (noPressEffect) {
      return;
    }
    if (active) {
      return setToggleEffect(true);
    }
    if (onPressOut) {
      onPressOut();
    }
    setToggleEffect(false);
  };

  const pressIn = () => {
    if (noPressEffect) {
      return;
    }
    if (active) {
      return setToggleEffect(false);
    }
    if (onPressIn) {
      onPressIn();
    }
    setToggleEffect(true);
  };

  if (isConvex) {
    return (
      <TouchableWithoutFeedback
        onPressOut={pressOut}
        onPressIn={pressIn}
        onPress={onPress}
        onLongPress={onLongPress}
        accessibilityRole={accessibilityRole}
        accessibilityStates={accessibilityStates}
        accessibilityLabel={accessibilityLabel}
        testID={testID}
      >
        <View>
          <NeuView
            {...props}
            concave={noPressEffect ? false : active ? true : toggleEffect}
            convex={noPressEffect ? false : active ? false : !toggleEffect}
          >
            {children}
          </NeuView>
        </View>
      </TouchableWithoutFeedback>
    );
  }

  return (
    <TouchableWithoutFeedback
      onPressOut={pressOut}
      onPressIn={pressIn}
      onPress={onPress}
      onLongPress={onLongPress}
      accessibilityRole={accessibilityRole}
      accessibilityStates={accessibilityStates}
      accessibilityLabel={accessibilityLabel}
      testID={testID}
    >
      <View>
        <NeuView
          {...props}
          inset={noPressEffect ? false : active ? active : toggleEffect}
        >
          {children}
        </NeuView>
      </View>
    </TouchableWithoutFeedback>
  );
};



export default NeuButton;
