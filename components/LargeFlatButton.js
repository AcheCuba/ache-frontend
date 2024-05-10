import React from "react";
import { Text, Dimensions, TouchableOpacity } from "react-native";
import { buttonColor } from "../constants/commonColors";

const { width } = Dimensions.get("screen");
const screeWidth = width;

const LargeFlatButton = ({
  text,
  onPress,
  _width = (4 / 5) * screeWidth,
  buttonHeight = screeWidth / 7,
  disabled = false,
  btStyle = {},
  textStyle = {},
}) => {
  return (
    <TouchableOpacity
      disabled={disabled}
      activeOpacity={0.6}
      onPress={onPress}
      style={[
        {
          backgroundColor: buttonColor,
          borderRadius: screeWidth / 7.5,
          width: _width,
          height: buttonHeight,
          justifyContent: "center",
          alignItems: "center",
        },
        btStyle,
      ]}
    >
      <Text
        style={[
          {
            color: "#fffc00", //"#01f9d2",
            //fontWeight: "bold",
            fontSize: 20,
            textTransform: "uppercase",
            fontFamily: "bs-bold",
          },
          textStyle,
        ]}
      >
        {text}
      </Text>
    </TouchableOpacity>
  );
};

export default LargeFlatButton;
