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
import { CommonActions } from "@react-navigation/native";

const { width } = Dimensions.get("screen");

const PagoCompletadoScreen = ({ navigation }) => {
  const { userState } = React.useContext(GlobalContext);
  const { socketState, socketDispatch, nuevaRecargaDispatch } =
    React.useContext(GlobalContext);
  const { globalUpdateCompleted } = socketState;

  const [soundPagoConfirmado, setSoundPagoConfirmado] = React.useState();
  const [soundFbPositivo, setSoundFbPositivo] = React.useState();
  const [updateForzado, setUpdateForzado] = React.useState(false);

  // es posible que esto lo use mas adelante
  /* React.useEffect(() => {
    if (globalUpdateCompleted || updateForzado) {
      // limpiar storage (user en proceso de recarga)
    }

  }, [globalUpdateCompleted, updateForzado]); */

  React.useEffect(() => {
    const timer_id = setTimeout(() => {
      //console.log("update forzado");
      setUpdateForzado(true);
    }, 10000);

    return () => clearTimeout(timer_id);
  }, []);

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
            {globalUpdateCompleted || updateForzado ? (
              <CommonNeuButton
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
                  /* navigation.reset({
                    index: 0,
                    routes: [{ name: "Juego" }],
                  }); */
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
