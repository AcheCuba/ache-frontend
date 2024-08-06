import React from "react";
import { Image } from "react-native";
import { View, Dimensions, ImageBackground } from "react-native";
import { TextBold } from "../../components/CommonText";
import {
  ResultadoPagoTextEnglish,
  ResultadoPagoTextSpanish,
} from "../../constants/Texts";
import { GlobalContext } from "../../context/GlobalProvider";
import { Audio } from "expo-av";
import { CommonActions } from "@react-navigation/native";
import LargeFlatButton from "../../components/LargeFlatButton";
import { useAndroidBackHandler } from "react-navigation-backhandler";

const { width } = Dimensions.get("screen");

const PagoCompletadoScreen = ({ navigation }) => {
  const { userState } = React.useContext(GlobalContext);
  const [soundPagoConfirmado, setSoundPagoConfirmado] = React.useState();
  const [soundFbPositivo, setSoundFbPositivo] = React.useState();

  useAndroidBackHandler(() => {
    /*
     *   Returning `true` denotes that we have handled the event,
     *   and react-navigation's lister will not get called, thus not popping the screen.
     *
     *   Returning `false` will cause the event to bubble up and react-navigation's listener will pop the screen.
     * */
    return true;
  });

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

  React.useEffect(() => {
    return soundFbPositivo
      ? () => {
          //console.log("Unloading Sound");
          soundFbPositivo.unloadAsync();
        }
      : undefined;
  }, [soundFbPositivo]);

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

  async function playSoundFbPositivo() {
    const _sound = new Audio.Sound();
    await _sound.loadAsync(require("../../assets/Sonidos/fb_positivo.wav"), {
      shouldPlay: true,
    });
    await _sound.setPositionAsync(0);
    await _sound.playAsync();
    //setSoundFbPositivo(_sound);
    setTimeout(() => {
      _sound.unloadAsync();
    }, 1000);
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
            <LargeFlatButton
              text={ResolveText("inicio")}
              onPress={async () => {
                //navigation.navigate("Juego");
                await playSoundFbPositivo();
                navigation.dispatch(
                  CommonActions.reset({
                    index: 0,
                    routes: [{ name: "Juego" }],
                  })
                );

                // nuevaRecargaDispatch(resetNuevaRecargaState());
                // socketDispatch(SetGlobalUpdateCompleted(false));
              }}
              screenWidth={width}
            />
          </View>
        </View>
      </View>
    </ImageBackground>
  );
};

export default PagoCompletadoScreen;
