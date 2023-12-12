import React from "react";
import { Image, Pressable, TouchableOpacity } from "react-native";
import { View } from "react-native";
import { buttonColor, generalBgColor } from "../constants/commonColors";
import NeuButton from "../libs/neu_element/NeuButton";

const CommonHeader = ({ width, height, _onPress }) => {
  const marginGlobal = width / 10;

  return (
    <View
      style={{
        paddingTop: 50,
        width: width,
        height: height / 6,
        backgroundColor: "transparent",
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
      <TouchableOpacity
        onPress={_onPress}
        style={{
          marginLeft: marginGlobal,
          marginTop: 10,
          backgroundColor: buttonColor,
          width: width / 7,
          height: width / 7 - 20,
          borderRadius: 5,
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Image
          source={require("../assets/images/iconos/atras.png")}
          style={{ width: 15, height: 15 }}
        />
      </TouchableOpacity>
    </View>
  );
};

export default CommonHeader;
