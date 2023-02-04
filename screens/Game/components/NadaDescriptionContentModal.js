import React, { useState } from "react";
import { Image } from "react-native";
import { View, Dimensions } from "react-native";


import NeuButton from "../../../libs/neu_element/NeuButton";

import { TextBold, TextItalic } from "../../../components/CommonText";
import {
  GameScreenTextEnglish,
  GameScreenTextSpanish,
} from "../../../constants/Texts";

// sale cuando presionas el boton de cobrar premio con La Nada

const { width, height } = Dimensions.get("screen");

const NadaDescriptionContentModal = ({
  navigation,
  setModalVisible,
  userState,
  horasRestantes,
}) => {
  const ResolveText = (site) => {
    const idioma = userState?.idioma;
    const textSpa = GameScreenTextSpanish();
    const textEng = GameScreenTextEnglish();

    if (idioma === "spa") {
      return textSpa[site];
    }

    if (idioma === "eng") {
      return textEng[site];
    }
  };
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
      <Image
        source={require("../../../assets/images/home/premios_finales/calavera_roja.png")}
        style={{ width: 160, height: 180 }}
      />
      <View
        style={{
          alignItems: "center",
          //paddingHorizontal: width / 10,
          marginTop: 35,
          width: width / 1.5,
        }}
      >
        <TextBold
          style={{
            color: "#01f9d2",
            fontWeight: "bold",
            fontSize: 20,
            textTransform: "uppercase",
          }}
          text={userState?.idioma === "spa" ? "Calavera" : "the skull"}
        />

        <TextItalic
          style={{
            color: "#01f9d2",
            fontStyle: "italic",
            fontSize: 18,
            marginTop: 20,
            textAlign: "center",
          }}
          text={
            userState?.idioma === "spa"
              ? `Sin ACHÉ. Espera ${horasRestantes} horas, o recarga.`
              : `No ACHÉ found. Wait ${horasRestantes} hours or send a recharge. `
          }
        />
        <View
          style={{
            height: 30,
            width: width,
          }}
        />
        <NeuButton
          color="#5f174d"
          width={(4 / 5) * width}
          height={width / 7.5}
          borderRadius={width / 7.5}
          onPress={() => {
            salir();
            navigation.jumpTo("Nueva Recarga", {
              screen: "NuevaRecargaScreen",
              params: { inOrderToCobrarPremio: false },
            });
          }}
          // style={{ marginTop: 80 }}
        >
          <TextBold
            text={ResolveText("recargar")}
            style={{
              color: "#fff800", //"#01f9d2",
              fontWeight: "bold",
              fontSize: 20,
              textTransform: "uppercase",
            }}
          />
        </NeuButton>
        <View
          style={{
            height: 25,
            width: width,
          }}
        />
        <NeuButton
          color="#5a154b"
          width={(4 / 5) * width}
          height={width / 7.5}
          borderRadius={width / 7.5}
          onPress={() => salir()}
          //style={{ marginTop: 25 }}
        >
          <TextBold
            text={ResolveText("salir")}
            style={{
              color: "#fff800", //"#01f9d2",
              fontWeight: "bold",
              fontSize: 20,
              textTransform: "uppercase",
            }}
          />
        </NeuButton>
      </View>
    </View>
  );
};
//701c57
export default NadaDescriptionContentModal;
