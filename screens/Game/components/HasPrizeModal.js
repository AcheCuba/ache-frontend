import React from "react";
import { Image } from "react-native";
import { View, Dimensions } from "react-native";
import { TextBold, TextItalic } from "../../../components/CommonText";
import LargeFlatButton from "../../../components/LargeFlatButton";

const { width } = Dimensions.get("screen");

const HasPrizeModal = ({ setModalVisible, userState }) => {
  const salir = () => {
    setModalVisible(false);
  };

  const RenderPrizeImage = () => {
    switch (userState.prize?.type) {
      case "Jackpot":
        return (
          <Image
            source={require("../../../assets/images/home/premios_finales/Diamante_GRAN_PREMIO.png")}
            style={{
              width: width / 5,
              height: width / 5,
            }}
          />
        );
      case "DoublePrize":
        return (
          <Image
            source={require("../../../assets/images/home/premios_finales/Monedas_250_CUP.png")}
            style={{
              width: width / 4.5,
              height: width / 4.6,
              //width: width / 3.8,
              //height: width / 3.9,
            }}
          />
        );

      default:
        return null;
    }
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
          width: width / 1.2,
        }}
      >
        <RenderPrizeImage />
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
              ? "La ruleta está desactivada porque ¡ya tienes un premio! 🥳 💫 \n Puedes encontrar tu premio en la esquina superior derecha de la Pantalla Principal. \n \n Agrega tu premio a una recarga o compártelo con familiares o amigos para poder volver a jugar. \n Si no usas tu premio en menos de 3 días desde el momento en que te lo ganaste, \n 😭 desaparecerá para siempre 💸 \n pero podrás volver a usar la ruleta."
              : "The wheel is locked because you already have a prize!!! 🥳 💫 \n You can find your prize in the top right corner of the Home Screen. \n \n Add you prize to a top-up or share it with your friends and family so you can play again. \n If you don’t use your prize in less than 3 days since you got it, \n 😭 It will be gone forever 💸 \n but you’ll be able to use the wheel again."
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
export default HasPrizeModal;
