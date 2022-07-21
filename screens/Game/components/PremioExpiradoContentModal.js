import React, { useState } from "react";
import { Image } from "react-native";
import { View, Dimensions } from "react-native";
import { NeuButton } from "react-native-neu-element";
import { TextBold, TextItalic } from "../../../components/CommonText";
import {
  GameScreenTextEnglish,
  GameScreenTextSpanish,
} from "../../../constants/Texts";

const { width, height } = Dimensions.get("screen");

const PremioExpiradoContentModal = ({
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
        source={require("../../../assets/images/emojis/emoji_triste.png")}
        style={{
          width: width / 2,
          height: width / 2,
        }}
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
            textAlign: "center",
          }}
          text={ResolveText("PremioExpiradoTitle")}
        />
        <TextItalic
          style={{
            color: "#01f9d2",
            fontStyle: "italic",
            fontSize: 18,
            marginTop: 30,
            textAlign: "center",
          }}
          text={ResolveText("PremioExpiradoBody")}
        />
        <View
          style={{
            height: 30,
            width: width,
          }}
        />

        <NeuButton
          color="#5c164b"
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
export default PremioExpiradoContentModal;
