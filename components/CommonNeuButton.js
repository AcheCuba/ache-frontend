import { Ionicons } from "@expo/vector-icons";
import React, { useState } from "react";
import { Image } from "react-native";
import { Text } from "react-native";
import NeuButton from "../libs/neu_element/NeuButton"

const CommonNeuButton = ({
  text,
  screenWidth,
  onPress,
  color = "#701c57",
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
