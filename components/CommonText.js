import React from "react";
import { Text } from "react-native";

export const TextBold = ({ text, style }) => {
  return (
    <Text
      style={{
        //fontFamily: "space-mono",
        fontFamily: "bs-bold",

        ...style,
      }}
    >
      {text}
    </Text>
  );
};

export const TextMedium = ({ text, style }) => {
  return (
    <Text
      style={{
        fontFamily: "bs-medium",

        ...style,
      }}
    >
      {text}
    </Text>
  );
};

export const TextItalic = ({ text, style }) => {
  return (
    <Text
      style={{
        fontFamily: "bs-italic",

        ...style,
      }}
    >
      {text}
    </Text>
  );
};

export const TextBoldItalic = ({ text, style }) => {
  return (
    <Text
      style={{
        fontFamily: "bs-bold-italic",
        ...style,
      }}
    >
      {text}
    </Text>
  );
};
