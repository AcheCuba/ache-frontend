import React from "react";
//import { StyleSheet } from "react-native";
//import { View } from "react-native";
import { Image, Dimensions, Platform } from "react-native";
//import NeuButton from "../../libs/neu_element/NeuButton"

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
   
    <Icon />

  );
};

export default TabButtonNeo;
