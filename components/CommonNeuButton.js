import React, { useState } from "react";
import { Text } from "react-native";
import NeuButton from "../libs/neu_element/NeuButton";
import { buttonColor } from "../constants/commonColors";

const CommonNeuButton = ({
  text,
  screenWidth,
  onPress,
  color = buttonColor,
  width = (4 / 5) * screenWidth,
}) => {
  return (
    <NeuButton
      color={color}
      width={width}
      height={screenWidth / 7.5}
      borderRadius={screenWidth / 7.5}
      onPress={onPress}
      style={{}}
    >
      <Text
        style={{
          color: "#fffc00", //"#01f9d2",
          //fontWeight: "bold",
          fontSize: 20,
          textTransform: "uppercase",
          fontFamily: "bs-bold",
        }}
      >
        {text}
      </Text>
    </NeuButton>
  );
};

export default CommonNeuButton;
