import React from "react";
import { View, Dimensions } from "react-native";
import { TextBold, TextItalic } from "../../../components/CommonText";

import LargeFlatButton from "../../../components/LargeFlatButton";
import { setHayPremioFallidoModal } from "../../../context/Actions/actions";
import { GlobalContext } from "../../../context/GlobalProvider";

const { width } = Dimensions.get("screen");

const PremioFallidoModal = ({ userState }) => {
  const { nuevaRecargaDispatch } = React.useContext(GlobalContext);

  const salir = () => {
    nuevaRecargaDispatch(setHayPremioFallidoModal(false));
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
              ? "🚫 ¡Ups! \n Premio en espera! "
              : "🚫 Oops! \n Prize on Hold! "
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
              ? "Intentamos enviar tu premio digital, pero parece \n que no pudo llegar a su destino. 😕 \n No te preocupes, tu premio sigue sano y salvo en la app, ¡listo para tu próximo intento! \n ¡Pero apúrate! Los premios solo duran unos días…"
              : "We tried to send your digital prize, but it seems like \n it couldn't reach its destination. 😕 \n Don't worry, your prize is still safe and sound in the app, ready for your next try! \n But hurry! Prizes only last so long…."
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
export default PremioFallidoModal;
