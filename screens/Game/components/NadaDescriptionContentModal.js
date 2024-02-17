import React, { useState } from "react";
import { Image } from "react-native";
import { View, Dimensions } from "react-native";
import { TextBold, TextItalic } from "../../../components/CommonText";
import {
  GameScreenTextEnglish,
  GameScreenTextSpanish,
} from "../../../constants/Texts";
import LargeFlatButton from "../../../components/LargeFlatButton";

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
              ? `Mala suerte... Espera ${horasRestantes} horas o recarga ahora`
              : `Oops... no luck this time. You have to wait ${horasRestantes} hours or buy a top-up now.`
          }
        />
        <View
          style={{
            height: 30,
            width: width,
          }}
        />
        <LargeFlatButton
          text={ResolveText("recargar")}
          onPress={() => {
            salir();
            navigation.jumpTo("Nueva Recarga", {
              screen: "NuevaRecargaScreen",
              params: { inOrderToCobrarPremio: false },
            });
          }}
        />

        <View
          style={{
            height: 25,
            width: width,
          }}
        />
        <LargeFlatButton text={ResolveText("salir")} onPress={() => salir()} />
      </View>
    </View>
  );
};
//701c57
export default NadaDescriptionContentModal;
