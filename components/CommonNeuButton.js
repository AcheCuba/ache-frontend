import { Ionicons } from "@expo/vector-icons";
import React, { useState } from "react";
import { Text } from "react-native";
import { NeuButton } from "react-native-neu-element";

const CommonNeuButton = ({ text, screenWidth, onPress }) => {
  return (
    <NeuButton
      color="#701c57"
      width={(4 / 5) * screenWidth}
      height={screenWidth / 7.5}
      borderRadius={screenWidth / 7.5}
      onPress={onPress}
      style={{}}
    >
      <Text
        style={{
          color: "#01f9d2",
          fontWeight: "bold",
          fontSize: 20,
          textTransform: "uppercase",
        }}
      >
        {text}
      </Text>
    </NeuButton>
  );
};

export default CommonNeuButton;
