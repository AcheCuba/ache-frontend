import { Ionicons } from "@expo/vector-icons";
import React, { useState } from "react";
import { Image } from "react-native";
import { View, Dimensions } from "react-native";
import { NeuButton } from "react-native-neu-element";

const CommonHeader = ({ width, height, _onPress }) => {
  const marginGlobal = width / 10;

  return (
    <View
      style={{
        paddingTop: 50,
        width: width,
        height: height / 6,
        backgroundColor: "rgba(112, 28, 87, 1)",
        flexDirection: "row",
        justifyContent: "space-between",
      }}
    >
      {/*   <NeuButton
        color="#701c57"
        width={width / 7}
        height={width / 7}
        borderRadius={width / 14}
        onPress={_onPress}
        style={{ marginLeft: marginGlobal, marginTop: 10 }}
      >
        <Ionicons name="chevron-back" size={30} color="#01f9d2" />
      </NeuButton> */}
      <NeuButton
        color="#701c57"
        width={width / 7}
        height={width / 7 - 20}
        borderRadius={5}
        onPress={_onPress}
        style={{ marginLeft: marginGlobal, marginTop: 10 }}
      >
        <Image
          source={require("../assets/images/iconos/atras.png")}
          style={{ width: 15, height: 15 }}
        />
      </NeuButton>
    </View>
  );
};

export default CommonHeader;
