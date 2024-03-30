import React, { useState } from "react";
import { Image } from "react-native";
import { View, Dimensions } from "react-native";
import { TextBold, TextItalic } from "../../../components/CommonText";
import {
  GameScreenTextEnglish,
  GameScreenTextSpanish,
} from "../../../constants/Texts";
import LargeFlatButton from "../../../components/LargeFlatButton";

const { width } = Dimensions.get("screen");

const PremioPendienteContent = ({ setModalVisible, userState }) => {
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

  const RenderPrizeImage = () => {
    const prizeType = userState?.prize.type;

    switch (prizeType) {
      case "Jackpot":
        return (
          <Image
            source={require("../../../assets/images/home/premios_finales/Diamante_GRAN_PREMIO.png")}
            style={{
              width: width / 4,
              height: width / 4,
            }}
          />
        );
      case "DoublePrize":
        return (
          <Image
            source={require("../../../assets/images/home/premios_finales/Monedas_250_CUP.png")}
            style={{
              width: width / 3,
              height: width / 3.1,
              //width: width / 3.8,
              //height: width / 3.9,
            }}
          />
        );

      default:
        return null;
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
      <RenderPrizeImage />
      <View
        style={{
          alignItems: "center",
          //paddingHorizontal: width / 10,
          //marginTop: 35,
          width: width / 1.5,
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
          text={ResolveText("PremioPendienteTitle")}
        />
        <TextItalic
          style={{
            color: "#01f9d2",
            fontStyle: "italic",
            fontSize: 18,
            marginTop: 30,
            textAlign: "center",
          }}
          text={ResolveText("PremioPendienteBody")}
        />
        <View
          style={{
            height: 30,
            width: width,
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
export default PremioPendienteContent;
