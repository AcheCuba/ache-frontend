import React from "react";
import { Image } from "react-native";
import { View, Dimensions } from "react-native";
import { TextBold, TextItalic } from "../../../components/CommonText";

import LargeFlatButton from "../../../components/LargeFlatButton";

const { width } = Dimensions.get("screen");

const PremioEnCaminoModal = ({ setModalVisible, userState }) => {
  const salir = () => {
    setModalVisible(false);
  };
  return (
    <View
      style={{
        alignItems: "center",
        justifyContent: "center",
        marginTop: 150,
      }}
    >
      <View
        style={{
          alignItems: "center",
          //paddingHorizontal: width / 10,
          //marginTop: 35,
          width: width / 1.4,
        }}
      >
        <TextBold
          style={{
            color: "#01f9d2",
            fontWeight: "bold",
            fontSize: 30,
            marginTop: 30,
            textTransform: "uppercase",
            textAlign: "center",
          }}
          text={
            userState?.idioma === "spa"
              ? "⏳ ¡Danos \n un segundo!"
              : "⏳ Hang Tight! "
          }
        />
        <TextItalic
          style={{
            color: "#01f9d2",
            fontStyle: "italic",
            fontSize: 23,
            marginTop: 30,
            textAlign: "center",
          }}
          text={
            userState?.idioma === "spa"
              ? "Tu premio está en camino! 🚀 \n Solo estamos esperando confirmar que todo salió bien. Vuelve a revisar en un rato para que puedas jugar otra vez y ¡ganar más premios! \n ¡Buena suerte!✨"
              : "Your top-up is on its way! 🚀 \n We're just waiting to confirm that everything went through. Check back in a bit so you can play again and win amazing prizes! \n Happy Spinning! ✨"
          }
        />
        <View
          style={{
            marginTop: 30,
            height: 30,
            width: width,
          }}
        />

        <LargeFlatButton
          text={userState?.idioma === "spa" ? "Entendido" : "Got it"}
          onPress={() => salir()}
        />
      </View>
    </View>
  );
};
export default PremioEnCaminoModal;
