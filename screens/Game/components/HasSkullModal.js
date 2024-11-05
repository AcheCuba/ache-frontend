import React from "react";
import { Image } from "react-native";
import { View, Dimensions } from "react-native";
import { TextBold, TextItalic } from "../../../components/CommonText";

import LargeFlatButton from "../../../components/LargeFlatButton";

const { width } = Dimensions.get("screen");

const HasSkullModal = ({ setModalVisible, userState, horasRestantes }) => {
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
        <Image
          source={require("../../../assets/images/home/premios_finales/calavera_roja.png")}
          style={{
            width: 80,
            height: 90,
          }}
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
              ? `¡Oh, no! La ruleta está desactivada porque te ganaste una Calavera ☠️ \n Puedes esperar ${horasRestantes} horas para que se elimine sola o puedes comprar una recarga y desaparecerá inmediatamente. \n Cuando la Calavera no esté, podrás volver a usar la ruleta. \n ¡Buena suerte! ✨ `
              : `¡Oh, no! The wheel is locked because you got a Skull ☠️ \n You can wait ${horasRestantes} hours and it will go away on its own or you can send a top-up and it will vanish right now! \n Once the Skull is gone you can use the wheel again \n Good luck! ✨`
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
export default HasSkullModal;
