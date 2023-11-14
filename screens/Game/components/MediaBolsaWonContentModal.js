import React, { useState } from "react";
import { Image } from "react-native";
import { View, Dimensions } from "react-native";
import NeuButton from "../../../libs/neu_element/NeuButton";
import { TextBold, TextItalic } from "../../../components/CommonText";
import {
  GameScreenTextEnglish,
  GameScreenTextSpanish,
} from "../../../constants/Texts";
import { buttonColor } from "../../../constants/commonColors";

const { width, height } = Dimensions.get("screen");

const MediaBolsaWonContentModal = ({
  navigation,
  setModalVisible,
  userState,
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
        source={require("../../../assets/images/home/premios_finales/Monedas_250_CUP.png")}
        style={{ width: 105, height: 101 }}
        //style={{ width: width / 3, height: width / 3.1 }}
      />
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
          }}
          text={ResolveText("MediaBolsaWonTitle")}
        />
        <TextItalic
          style={{
            color: "#01f9d2",
            fontStyle: "italic",
            fontSize: 18,
            marginTop: 30,
            textAlign: "center",
          }}
          text={ResolveText("MediaBolsaWonBody")}
        />
        <View
          style={{
            height: 30,
            width: width,
          }}
        />
        <NeuButton
          color={buttonColor}
          width={(4 / 5) * width}
          height={width / 7.5}
          borderRadius={width / 7.5}
          onPress={() => {
            salir();
            navigation.jumpTo("Nueva Recarga", {
              screen: "NuevaRecargaScreen",
              params: { inOrderToCobrarPremio: true },
            });
          }}
          // style={{ marginTop: 80 }}
        >
          <TextBold
            text={ResolveText("obtenerPremio")}
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
          color={buttonColor}
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
export default MediaBolsaWonContentModal;
