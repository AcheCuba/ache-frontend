import React from "react";
import { StyleSheet, Text, TouchableOpacity } from "react-native";

const CustomButton = ({ onPress, title, customStyle, disabled }) => {
  // console.log("disabled", disabled);
  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={disabled}
      style={[styles.CustomButtonContainer, customStyle]}
    >
      <Text style={styles.CustomButtonText}>{title}</Text>
    </TouchableOpacity>
  );
};

export default CustomButton;

const styles = StyleSheet.create({
  CustomButtonContainer: {
    elevation: 8,
    //backgroundColor: "#009688",
    backgroundColor: "rgba(112, 28, 87, 1)",
    borderRadius: 10,
    paddingVertical: 10,
    paddingHorizontal: 12,
  },
  CustomButtonText: {
    fontSize: 18,
    color: "#fff",
    fontWeight: "bold",
    alignSelf: "center",
    textTransform: "uppercase",
  },
});
