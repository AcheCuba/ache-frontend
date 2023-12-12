import React from "react";
import { Image } from "react-native";
import { ImageBackground } from "react-native";
import { View, Dimensions } from "react-native";
import { TextBold } from "../../components/CommonText";
import {
  ResultadoPagoTextEnglish,
  ResultadoPagoTextSpanish,
} from "../../constants/Texts";
import { GlobalContext } from "../../context/GlobalProvider";
import { CommonActions } from "@react-navigation/native";
import LargeFlatButton from "../../components/LargeFlatButton";

const { width } = Dimensions.get("screen");

const PagoErrorScreen = ({ navigation }) => {
  const { userState, nuevaRecargaState } = React.useContext(GlobalContext);

  // es posible que esto lo use mas adelante
  /* React.useEffect(() => {
    console.log("useEffect pago error")
    // limpiar storage (user en proceso de recarga)

  }) */

  const ResolveText = (site) => {
    const idioma = userState?.idioma;
    const textSpa = ResultadoPagoTextSpanish();
    const textEng = ResultadoPagoTextEnglish();

    if (idioma === "spa") {
      return textSpa[site];
    }

    if (idioma === "eng") {
      return textEng[site];
    }
  };

  return (
    <ImageBackground
      source={require("../../assets/images/degradado_general.png")}
      style={{
        width: "100%",
        height: "100%",
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
      }}
      transition={false}
    >
      <View
        style={{
          flex: 1,
          width: "100%",
          //justifyContent: "center",
          marginTop: 150,
        }}
      >
        <View
          style={{
            width: "100%",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Image
            source={require("../../assets/images/emojis/emoji_triste.png")}
            style={{
              width: width / 2,
              height: width / 2,
            }}
          />
        </View>
        <View
          style={{
            width: "100%",
            justifyContent: "center",
            alignItems: "center",
            marginTop: 60,
          }}
        >
          <View style={{ width: "80%" }}>
            <TextBold
              text={ResolveText("errorEnPago")}
              style={{
                fontSize: 22,
                fontWeight: "bold",
                color: "#01f9d2",
                textAlign: "center",
                //textTransform: "uppercase",
              }}
            />
          </View>
        </View>

        <View style={{ width: "100%", alignItems: "center" }}>
          <View style={{ marginTop: 50 }}>
            <LargeFlatButton
              text={ResolveText("reintentar")}
              onPress={() => {
                //navigation.navigate("Juego");
                navigation.dispatch(
                  CommonActions.reset({
                    index: 0,
                    routes: [{ name: "Juego" }],
                  })
                );
              }}
              screenWidth={width}
            />
          </View>
        </View>
      </View>
    </ImageBackground>
  );
};

export default PagoErrorScreen;
