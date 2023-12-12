import React from "react";
import { Image } from "react-native";
import { View, Dimensions } from "react-native";
import NeuButton from "../../../libs/neu_element/NeuButton";
import {
  TextBold,
  TextItalic,
  TextMedium,
} from "../../../components/CommonText";
import {
  GameScreenTextEnglish,
  GameScreenTextSpanish,
} from "../../../constants/Texts";
import { buttonColor } from "../../../constants/commonColors";
import LargeFlatButton from "../../../components/LargeFlatButton";

const { width, height } = Dimensions.get("screen");

const JoyaWonContentModal = ({ navigation, setModalVisible, userState }) => {
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
        source={require("../../../assets/images/home/premios_finales/Diamante_GRAN_PREMIO.png")}
        //style={{ width: width / 4, height: width / 4 }}
        style={{ width: 120, height: 100 }}
      />
      <View
        style={{
          alignItems: "center",
          //paddingHorizontal: width / 10,
          width: width / 1.5,
        }}
      >
        <TextBold
          style={{
            color: "#01f9d2",
            fontWeight: "bold",
            fontSize: 20,
            textTransform: "uppercase",
            marginTop: 30,
          }}
          text={ResolveText("JoyaWonTitle")}
        />
        <TextMedium
          style={{
            color: "#01f9d2",
            fontStyle: "italic",
            fontSize: 18,
            marginTop: 30,
            textAlign: "center",
          }}
          text={ResolveText("JoyaWonBody")}
        />
        <View
          style={{
            height: 30,
            width: width,
          }}
        />
        <LargeFlatButton
          text={ResolveText("obtenerPremio")}
          onPress={() => {
            salir();
            navigation.jumpTo("Nueva Recarga", {
              screen: "NuevaRecargaScreen",
              params: { inOrderToCobrarPremio: true },
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
export default JoyaWonContentModal;
