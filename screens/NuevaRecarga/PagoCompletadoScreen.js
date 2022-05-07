import React from "react";
import { ActivityIndicator } from "react-native";
import { Image } from "react-native";
import { View, Dimensions, ImageBackground } from "react-native";
import CommonNeuButton from "../../components/CommonNeuButton";
import { TextBold } from "../../components/CommonText";
import {
  ResultadoPagoTextEnglish,
  ResultadoPagoTextSpanish,
} from "../../constants/Texts";
import {
  resetNuevaRecargaState,
  SetGlobalUpdateCompleted,
} from "../../context/Actions/actions";
import { GlobalContext } from "../../context/GlobalProvider";
import { Audio } from "expo-av";

const { width } = Dimensions.get("screen");

const PagoCompletadoScreen = ({ navigation }) => {
  const { userState } = React.useContext(GlobalContext);
  const { socketState, socketDispatch, nuevaRecargaDispatch } =
    React.useContext(GlobalContext);
  const { globalUpdateCompleted } = socketState;

  const [soundPagoConfirmado, setSoundPagoConfirmado] = React.useState();

  /* React.useEffect(() => {
    console.log(globalUpdateCompleted);
  }, [globalUpdateCompleted]); */

  React.useEffect(() => {
    playSoundPagoConfirmado();
  }, []);

  React.useEffect(() => {
    return soundPagoConfirmado
      ? () => {
          //console.log("Unloading Sound");
          soundPagoConfirmado.unloadAsync();
        }
      : undefined;
  }, [soundPagoConfirmado]);

  async function playSoundPagoConfirmado() {
    //console.log("Loading Sound");
    const _sound = new Audio.Sound();
    await _sound.loadAsync(
      require("../../assets/Sonidos/pago_confirmado.wav"),
      {
        shouldPlay: true,
      }
    );
    await _sound.setPositionAsync(0);
    await _sound.playAsync();
    setSoundPagoConfirmado(_sound);
    //console.log("Playing Sound");
  }

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
      <View style={{ flex: 1, width: "100%" }}>
        <View
          style={{
            width: "100%",
            justifyContent: "center",
            alignItems: "center",
            marginTop: 100,
          }}
        >
          {/*  <Image
            source={require("../../assets/images/recarga_check.png")}
            style={{ width: 148, height: 152 }}
          /> */}
          <Image
            source={require("../../assets/animaciones/moneda-check.gif")}
            style={{ width: 250, height: 260 }}
          />
        </View>
        <View
          style={{
            width: "100%",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <View style={{ width: "80%" }}>
            <TextBold
              text={ResolveText("pagoCompletado")}
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
            {globalUpdateCompleted ? (
              <CommonNeuButton
                text={ResolveText("jugar")}
                onPress={() => {
                  navigation.navigate("Juego");
                  nuevaRecargaDispatch(resetNuevaRecargaState());
                  socketDispatch(SetGlobalUpdateCompleted(false));
                }}
                screenWidth={width}
              />
            ) : (
              <ActivityIndicator size="large" color="#01f9d2" />
            )}
          </View>
        </View>
      </View>
    </ImageBackground>
  );
};

export default PagoCompletadoScreen;
