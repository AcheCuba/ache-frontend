import React from "react";
import { View, Dimensions } from "react-native";
import { TextBold, TextItalic } from "../../../components/CommonText";

import LargeFlatButton from "../../../components/LargeFlatButton";
import { setHayPremioCobradoModal } from "../../../context/Actions/actions";
import { GlobalContext } from "../../../context/GlobalProvider";

const { width } = Dimensions.get("screen");

const PremioCobradoModal = ({ userState }) => {
  const { nuevaRecargaDispatch } = React.useContext(GlobalContext);

  const salir = () => {
    nuevaRecargaDispatch(setHayPremioCobradoModal(false));
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
              ? "🎉 ¡Hurra! \n ¡Premio Cobrado!"
              : "🎉 Hooray! \n Prize Collected!"
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
              ? "¡Tu premio digital ha sido cobrado! Un pajarito nos dijo que el recarga que enviaste con tu premio acaba de llegar. 🎁 \n Como ya cumplió su misión, tu premio ha desaparecido de la app. ¡Pero no te preocupes—todavía hay más diversión por venir! ¡Gira la ruleta de nuevo para otra oportunidad de ganar! ¡Buena suerte y muchas gracias por ser parte de Spin!"
              : "Your digital prize has been cashed in! A birdie told us that the top-up you sent with the prize just arrived! 🎁 \n Since the magic has happened, your prize has vanished from the app. But don’t worry—there’s still more fun to be had! Spin the roulette again for another chance to win big! Good luck and enjoy getting even more bang for your buck. \n Happy Spinning!"
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
export default PremioCobradoModal;
