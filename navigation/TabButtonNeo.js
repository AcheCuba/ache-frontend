import React from "react";
import { StyleSheet } from "react-native";
import { View } from "react-native";
import { Image, Dimensions, Platform } from "react-native";
import { NeuView, NeuButton } from "react-native-neu-element";

const TabButtonNeo = ({ iconName }) => {
  const StyledCrossPlat = (shadowPosition) => {
    if (shadowPosition === "bottomShadow") {
      return {
        shadowColor: "rgba(201, 147, 185,0.5)",
        shadowOffset: { width: -3, height: -3 },
        shadowOpacity: Platform.OS === "android" ? 5 : 0.5,
        shadowRadius: 7,
        elevation: Platform.OS === "android" ? 10 : null,
      };
    }

    if (shadowPosition === "topShadow") {
      return {
        shadowColor: "#1f0918",
        shadowOffset: { width: 3, height: 3 },
        shadowOpacity: Platform.OS === "android" ? 5 : 0.5,
        shadowRadius: 7,
        elevation: Platform.OS === "android" ? 10 : null,
      };
    }
  };

  const Icon = () => {
    switch (iconName) {
      case "Ruleta":
        return (
          <Image
            source={require("../assets/images/iconos/Ruleta.png")}
            style={{ width: 35, height: 30, marginLeft: 5 }}
          />
        );
      case "Recarga":
        return (
          <Image
            source={require("../assets/images/iconos/RecargaRapida.png")}
            style={{ width: 32, height: 32 }}
          />
        );
      case "Settings":
        return (
          <Image
            source={require("../assets/images/iconos/Settings.png")}
            style={{ width: 32, height: 32 }}
          />
        );
      case "Idioma":
        return (
          <Image
            source={require("../assets/images/iconos/Idioma.png")}
            style={{ width: 32, height: 32 }}
          />
        );
      default:
        return null;
    }
  };

  return (
    /*    <NeuButton
      color="#701c57"
      width={50}
      height={50}
      borderRadius={25}
      style={{ justifyContent: "center", alignItems: "center" }}
    >
      <Icon />
    </NeuButton> */
    <Icon />

    /*   <View
      style={{
        backgroundColor: "#701c57",
        width: 58,
        height: 58,
        borderRadius: 29,
        ...StyledCrossPlat("topShadow"),
      }}
    >
      <View
        style={{
          //borderWidth: 0.5,
          //borderColor: "#eee"
          backgroundColor: "#701c57",
          width: 58,
          height: 58,
          borderRadius: 29,
          justifyContent: "center",
          alignItems: "center",
          ...StyledCrossPlat("bottomShadow"),
        }}
      >
      </View>
    </View> */
  );
};

export default TabButtonNeo;
