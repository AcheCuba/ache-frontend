import * as React from "react";
import {
  StyleSheet,
  View,
  Dimensions,
  ImageBackground,
  Image,
  TouchableWithoutFeedback,
  Animated,
  Easing,
  TouchableOpacity,
} from "react-native";
import axios from "axios";
import { BASE_URL } from "../../constants/domain";
import { GlobalContext } from "../../context/GlobalProvider";
import {
  resetNuevaRecargaState,
  setHayPremioCobradoModal,
  setHayPremioFallidoModal,
  setPrizeForUser,
  setShowExpiredPrize,
} from "../../context/Actions/actions";
import Toast from "react-native-root-toast";
import moment from "moment";

import { storeData } from "../../libs/asyncStorage.lib";

import ConfettiCannon from "react-native-confetti-cannon";
import { Modal } from "react-native";

import { RootSiblingParent } from "react-native-root-siblings";
import CobrarPremioContent from "./components/CobrarPremioContent";
import {
  GameScreenTextEnglish,
  GameScreenTextSpanish,
} from "../../constants/Texts";
import { TextBold, TextItalic } from "../../components/CommonText";
import { LinearGradient } from "expo-linear-gradient";
import NadaDescriptionContentModal from "./components/NadaDescriptionContentModal";
import DoublePrizeWonContentModal from "./components/DoublePrizeWonContentModal";
import JoyaWonContentModal from "./components/JoyaWonContentModal";
import { Text } from "react-native";
import { getNetworkState } from "../../libs/networkState.lib";
import { Audio } from "expo-av";
import PremioExpiradoContentModal from "./components/PremioExpiradoContentModal";
import {
  bgColorFinalGradient,
  btPremioColor,
  generalBgColor,
  generalBgColorTrans5,
} from "../../constants/commonColors";
import LargeFlatButton from "../../components/LargeFlatButton";
import LoadingUserDataDummyModal from "./components/LoadingUserDataDummyModal";
import { getPrizeForUser } from "../../libs/getPrizeForUser";
import PremioCobradoModal from "./components/PremioCobradoModal";
import PremioFallidoModal from "./components/PremioFallidoModal";
import PremioEnCaminoModal from "./components/PremioEnCaminoModal";
import HasPrizeModal from "./components/HasPrizeModal";
import HasSkullModal from "./components/HasSkullModal";
import TopUpBonusWonContentModal from "./components/TopUpBonusWonContentModal";

const { width, height } = Dimensions.get("screen");

/* async function storeSacureValue(key, value) {
  await SecureStore.setItemAsync(key, value);
} */

const GameScreen = ({ navigation }) => {
  //const expoPushToken = useExpoPushToken();

  // =====
  // animations
  const fadeAnim = React.useRef(new Animated.Value(0)).current; // Valor inicial de opacidad 0 (invisible)
  const [animate, SetAnimate] = React.useState(false);
  const [clickEvent, SetClickEvent] = React.useState(false);

  // ======
  // modals
  const [modalCobrarPremioVisible, setModalCobrarPremioVisible] =
    React.useState(false);
  const [codigoGenerado, setCodigoGenerado] = React.useState(false);

  const [NadaWon, setNadaWon] = React.useState(false);
  const [DoublePrizeWon, setDoublePrizeWon] = React.useState(false);
  const [JoyaWon, setJoyaWon] = React.useState(false);
  const [TopUpBonusWon, setTopUpBonusWon] = React.useState(false);

  const [horasRestantes, setHorasRestantes] = React.useState("24");
  const [nadaDescriptionModalVisible, setNadaDescriptionModalVisible] =
    React.useState(false);
  const [premioEnCamino, setPremioEnCamino] = React.useState(false);
  const [hasPrizeModal, setHasPrizeModal] = React.useState(false);
  const [hasSkullModal, setHasSkullModal] = React.useState(false);

  //sonidos
  const [soundError, setSoundError] = React.useState();
  const [soundGanasCalavera, setSoundGanasCalavera] = React.useState();
  const [soundGanasPremioDigital, setSoundGanasPremioDigital] =
    React.useState();
  const [soundGanasGranPremio, setSoundGanasGranPremio] = React.useState();
  const [soundImpulsoRuleta, setSoundImpulsoRuleta] = React.useState();
  const [prizeCollectedError, setPrizeCollectedError] = React.useState(false);
  const [prizePendingError, setPrizePendingError] = React.useState(false);
  const [prizeInactiveError, setPrizeInactiveError] = React.useState(false);
  const [verificationError, setVerificationError] = React.useState(false);

  const [
    loadingUserDataDummyModalVisible,
    setLoadingUserDataDummyModalVisible,
  ] = React.useState(false);

  const [casillaFinal, setCasillaFinal] = React.useState("7200deg");
  const thereIsPrizeResult = React.useRef(false);
  const {
    userState,
    userDispatch,
    nuevaRecargaDispatch,
    nuevaRecargaState,
    interfaceState,
    interfaceDispatch,
  } = React.useContext(GlobalContext);

  const wheelValue = React.useRef(new Animated.Value(0));
  const enMovimiento = React.useRef(false);
  const ruletaSensible = React.useRef(true);

  //proporción que funciona  -> 7/4000 = 20/x -> x = aprox(12000)

  const ANIMATION_TIME = 10000; // ms (movimiento de ruleta)
  const SENSIBILITY_TIME = 4000; //mantener proporción con ANIMATION_TIME
  const TO_VALUE = 20;

  const { showExpiredPrize, showInvisibleLoadData } = interfaceState;

  const { hayPremioCobrado } = nuevaRecargaState;
  const { hayPremioFallido } = nuevaRecargaState;

  /* React.useEffect(() => {
    console.log(userState.prize);
  }, [userState]); */

  React.useEffect(() => {
    // console.log("fade anim");
    Animated.timing(fadeAnim, {
      toValue: 1, // Opacidad al 1 (completamente visible)
      duration: 500, // Duración de la animación
      useNativeDriver: true,
    }).start();
  }, []);

  React.useEffect(() => {
    if (showInvisibleLoadData) {
      setLoadingUserDataDummyModalVisible(true);
      setTimeout(() => {
        setLoadingUserDataDummyModalVisible(false);
      }, 500);
    }
  }, [showInvisibleLoadData]);

  React.useEffect(() => {
    if (verificationError) {
      Toast.show(
        userState.idioma == "spa"
          ? "No hemos podido verificar el estado de este premio. Intente más tarde"
          : "We have not been able to verify the status of this award. Please try again later",
        {
          duaration: Toast.durations.LONG,
          position: Toast.positions.BOTTOM,
          shadow: true,
          animation: true,
          hideOnPress: true,
          delay: 0,
        }
      );
      setVerificationError(false);
    }
  }, [verificationError]);

  /*  React.useEffect(() => {
    console.log("game", userState.prize);
  }, [userState]); */

  React.useEffect(() => {
    if (prizeCollectedError) {
      Toast.show(
        userState.idioma == "spa"
          ? "Este premio ya ha sido cobrado"
          : "This prize has already been collected",
        {
          duaration: Toast.durations.LONG,
          position: Toast.positions.BOTTOM,
          shadow: true,
          animation: true,
          hideOnPress: true,
          delay: 0,
        }
      );
      setPrizeCollectedError(false);
    }
  }, [prizeCollectedError]);

  React.useEffect(() => {
    if (prizePendingError) {
      Toast.show(
        userState.idioma == "spa"
          ? "La transaccion de su premio aún está en progreso."
          : "Your prize transaction is still in progress.",
        {
          duaration: Toast.durations.LONG,
          position: Toast.positions.BOTTOM,
          shadow: true,
          animation: true,
          hideOnPress: true,
          delay: 0,
        }
      );
      setPrizePendingError(false);
    }
  }, [prizePendingError]);

  React.useEffect(() => {
    if (prizeInactiveError) {
      Toast.show(
        userState.idioma == "spa"
          ? "Este premio no está activo"
          : "This prize is not active",
        {
          duaration: Toast.durations.LONG,
          position: Toast.positions.BOTTOM,
          shadow: true,
          animation: true,
          hideOnPress: true,
          delay: 0,
        }
      );
      setPrizeInactiveError(false);
    }
  }, [prizeInactiveError]);

  async function playSoundImpulsoRuleta() {
    const _sound = new Audio.Sound();
    await _sound.loadAsync(require("../../assets/Sonidos/impulso_ruleta.wav"), {
      shouldPlay: true,
    });
    await _sound.setPositionAsync(0);
    await _sound.playAsync();
    setSoundImpulsoRuleta(_sound);
  }

  async function playSoundError() {
    const _sound = new Audio.Sound();
    await _sound.loadAsync(require("../../assets/Sonidos/error.wav"), {
      shouldPlay: true,
    });
    await _sound.setPositionAsync(0);
    await _sound.playAsync();
    setSoundError(_sound);
  }

  async function playSoundGanasCalavera() {
    const _sound = new Audio.Sound();
    await _sound.loadAsync(require("../../assets/Sonidos/ganas_calavera.wav"), {
      shouldPlay: true,
    });
    await _sound.setPositionAsync(0);
    await _sound.playAsync();
    setSoundGanasCalavera(_sound);
  }

  async function playSoundGranPremio() {
    const _sound = new Audio.Sound();
    await _sound.loadAsync(
      require("../../assets/Sonidos/ganas_gran_premio.wav"),
      {
        shouldPlay: true,
      }
    );
    await _sound.setPositionAsync(0);
    await _sound.playAsync();
    setSoundGanasGranPremio(_sound);
  }

  async function playSoundGanasPremioDigital() {
    const _sound = new Audio.Sound();
    await _sound.loadAsync(
      require("../../assets/Sonidos/ganas_premio_dig.wav"),
      {
        shouldPlay: true,
      }
    );
    await _sound.setPositionAsync(0);
    await _sound.playAsync();
    setSoundGanasPremioDigital(_sound);
  }

  React.useEffect(() => {
    return soundError
      ? () => {
          soundError.unloadAsync();
        }
      : undefined;
  }, [soundError]);

  React.useEffect(() => {
    return soundGanasCalavera
      ? () => {
          soundGanasCalavera.unloadAsync();
        }
      : undefined;
  }, [soundGanasCalavera]);

  React.useEffect(() => {
    return soundGanasGranPremio
      ? () => {
          soundGanasGranPremio.unloadAsync();
        }
      : undefined;
  }, [soundGanasGranPremio]);

  React.useEffect(() => {
    return soundGanasPremioDigital
      ? () => {
          soundGanasPremioDigital.unloadAsync();
        }
      : undefined;
  }, [soundGanasPremioDigital]);

  React.useEffect(() => {
    return soundImpulsoRuleta
      ? () => {
          soundImpulsoRuleta.unloadAsync();
        }
      : undefined;
  }, [soundImpulsoRuleta]);

  const startAnimation = () => {
    SetAnimate(true);
    SetClickEvent(true);

    setTimeout(() => {
      SetAnimate(false);
    }, 5000);
  };

  const ImageConditional = ({ typeOfPrize }) => {
    //console.log(typeOfPrize);

    switch (typeOfPrize) {
      case "Jackpot":
        return (
          <Image
            source={require("../../assets/images/home/premios_finales/Diamante_GRAN_PREMIO.png")}
            //resizeMode="center"
            style={{
              width: 80, //width: 60,
              height: 60, //height: 92,
            }}
          />
        );
      case "DoublePrize":
        return (
          <Image
            source={require("../../assets/images/home/premios_finales/Monedas_500_CUP.png")}
            //resizeMode="center"
            style={{
              width: 73, //width: 60,
              height: 70, //height: 92,
            }}
          />
        );
      case "TopUpBonus":
        return (
          <Image
            source={require("../../assets/images/home/premios_finales/Monedas_250_CUP.png")}
            //resizeMode="center"
            style={{
              width: 73, //width: 60,
              height: 70, //height: 92,
            }}
          />
        );

      case "Nada":
        return (
          <View>
            <Image
              source={require("../../assets/images/home/premios_finales/calavera_roja.png")}
              style={{
                width: 65,
                height: 75,
              }}
            />
          </View>
        );
      default:
        return (
          <View>
            <Image
              source={require("../../assets/images/home/boton_vacio.png")}
              style={{
                width: 160,
                height: 160,
              }}
            />
          </View>
        );
    }
  };

  const setCasilla = (prize) => {
    let random_seed;
    //console.log("prize", prize);

    //switch(prize.type)

    switch (prize.type) {
      case "Nada":
        setTimeout(() => {
          setNadaWon(true);
          playSoundGanasCalavera();
        }, ANIMATION_TIME);

        // pa que se vaya solo
        /*   setTimeout(() => {
          setNadaWon(true);
          setTimeout(() => {
            setNadaWon(false);
          }, 10000);
        }, 8000); */

        random_seed = Math.random();

        if (random_seed < 0.33) {
          //setCasillaFinal("1913deg");
          setCasillaFinal("7313deg");
        }
        if (random_seed >= 0.33 && random_seed < 0.66) {
          //setCasillaFinal("2003deg");
          setCasillaFinal("7403deg");
        }
        if (random_seed >= 0.66) {
          //setCasillaFinal("2093deg");
          setCasillaFinal("7493deg");
        }
        break;
      case "Jackpot":
        setTimeout(() => {
          startAnimation();
        }, ANIMATION_TIME);

        setTimeout(() => {
          setJoyaWon(true);
          playSoundGranPremio();
        }, ANIMATION_TIME + 6000);

        //setCasillaFinal("1823deg");
        setCasillaFinal("7223deg"); // slot 1: premio gordo

        break;

      case "TopUpBonus":
        setTimeout(() => {
          setTopUpBonusWon(true);
          playSoundGanasPremioDigital();
        }, ANIMATION_TIME);

        random_seed = Math.random();

        if (random_seed < 0.5) {
          setCasillaFinal("7268deg"); // slot 2: pemio simple
        }

        if (random_seed >= 0.5) {
          setCasillaFinal("7358deg"); // slot 4: premio simple
        }
        break;

      case "DoublePrize":
        //console.log("sellama");
        setTimeout(() => {
          setDoublePrizeWon(true);
          playSoundGanasPremioDigital();
        }, ANIMATION_TIME);
        //setCasillaFinal("1823deg");

        random_seed = Math.random();

        if (random_seed < 0.5) {
          setCasillaFinal("7178deg"); // slot 8: premio doble
        }
        if (random_seed >= 0.5) {
          setCasillaFinal("7088deg"); // slot 6: premio doble
        }

        break;
      default:
        setCasillaFinal("7200deg");
        break;
    }
  };

  const verificarPremioActual = () => {
    // hay algo en la app
    const currentTime = moment();
    const expirationDate = moment(userState.prize?.expirationDate).local();
    // para mostrar en pantalla (modal):
    const horas_restantes = expirationDate.diff(currentTime, "hours");

    // verificar si el premio ha expirado
    getPrizeForUser(userState)
      .then((response) => {
        const hasPrize = response.data.hasPrize;
        if (hasPrize) {
          // aun tiene algo
          console.log("horas restantes", horas_restantes);
          setHorasRestantes(horas_restantes);
        } else {
          console.log("premio expirado");
          // lo que tenia (premio o skull) expiro
          // se elimina de la app
          // deja de estar gris cuando el modal caiga.
          storeData("user", {
            ...userState,
            prize: null,
          });
          userDispatch(setPrizeForUser(null));
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const onPressWheel = async (touchOn) => {
    const networkState = await getNetworkState();
    //console.log(networkState);
    if (!networkState.isConnected || !networkState.isInternetReachable) {
      playSoundError();
      let toast = Toast.show(ResolveText("errorConexion"), {
        duaration: Toast.durations.LONG,
        position: Toast.positions.BOTTOM,
        shadow: true,
        animation: true,
        hideOnPress: true,
        delay: 0,
      });
    } else {
      if (!enMovimiento.current) {
        playSoundImpulsoRuleta(); // la primera vez
        setTimeout(() => {
          ruletaSensible.current = false;
        }, SENSIBILITY_TIME);
      }

      if (enMovimiento.current) {
        if (ruletaSensible.current) {
          if (touchOn === "slots") {
            playSoundImpulsoRuleta();
          }
        }
      } else {
        setCasillaFinal("7200deg");
        wheelRotateLoop();

        const current_prize = userState.prize;

        const user_token = userState.token;
        const url = `${BASE_URL}/prize/play`;

        const config = {
          method: "post",
          url: url,
          headers: {
            Authorization: `Bearer ${user_token}`,
          },
        };

        // test
        // makePlayRequestFake();
        // test

        if (current_prize === null) {
          makePlayRequest(config);
        }
      }
    }
  };

  /*   const makePlayRequestFake = () => {
    thereIsPrizeResult.current = true;
    setCasilla({ type: "Nada" });
  }; */

  const makePlayRequest = (config) => {
    axios(config)
      .then((response) => {
        const prize_result = response.data;
        console.log("prize result", prize_result);

        // probar premio falso para ver textos o whathever
        /*     const prize_result = {
          //type: "Nada",
          //type: "Jackpot",
          //type: "DoublePrize",
          //type: "TopUpBonus",
        }; */

        thereIsPrizeResult.current = true;

        if (prize_result === "" || prize_result === undefined) {
          setCasilla({ type: "Nada" });
          // time
          const expirationDate = moment().add(1, "days");
          nuevaRecargaDispatch(resetNuevaRecargaState());

          setTimeout(() => {
            //storeData({ ...userState, prize: null });
            //userDispatch(set_prize(null));
            storeData("user", {
              ...userState,
              prize: {
                type: "Nada",
                expirationDate,
              },
            });
            userDispatch(
              setPrizeForUser({
                type: "Nada",
                expirationDate,
              })
            );
          }, ANIMATION_TIME);
        } else {
          // se gana un premio
          setCasilla(prize_result);

          // time

          //const expirationDate = moment(prize_result.expirationDate).local();
          //const expirationDate = moment().add(3, "days");
          //const expirationDate = moment().add(3, "minutes"); //test

          // nuevaRecargaDispatch(resetNuevaRecargaState());

          setTimeout(() => {
            storeData("user", {
              ...userState,
              prize: {
                ...prize_result,
              },
            });
            userDispatch(
              setPrizeForUser({
                ...prize_result,
              })
            );
          }, ANIMATION_TIME);
        }
      })
      .catch((error) => {
        //console.log(error.response);
        //console.log("catch");
        thereIsPrizeResult.current = false;
        Toast.show(error.message, {
          duaration: Toast.durations.SHORT,
          position: Toast.positions.BOTTOM,
        });
      });
  };

  // 5 vueltas cada 3 segundos
  // para 12 segundos -> 20 vueltas

  /* function drawRuleta(x) {
    //console.log(x);
    //let magic_factor = 1.15;

    if (x < 0.8) {
      magic_factor = 0.9;
    } else {
      magic_factor = 1.1;
    } 

    return Easing.cubic(0.91 * x);
  } */

  const wheelRotateLoop = () => {
    if (!enMovimiento.current) {
      wheelValue.current.setValue(0);
      enMovimiento.current = true;
      Animated.timing(wheelValue.current, {
        toValue: TO_VALUE,
        duration: ANIMATION_TIME,
        easing: Easing.out(Easing.cubic),
        //easing: Easing.out(drawRuleta),
        //easing: Easing.out(Easing.quad),
        useNativeDriver: true,
      }).start((complete) => {
        if (complete.finished) {
          if (!thereIsPrizeResult.current) {
            enMovimiento.current = false;
            let toast = Toast.show(ResolveText("errorDesconocido"), {
              duaration: Toast.durations.LONG,
              position: Toast.positions.BOTTOM,
              shadow: true,
              animation: true,
              hideOnPress: true,
              delay: 0,
            });
          } else {
            //wheelRotateFinal();
            enMovimiento.current = false;
            thereIsPrizeResult.current = false;
            ruletaSensible.current = true;
          }
        }
      });
    }
  };

  const wheelLoop = wheelValue.current.interpolate({
    inputRange: [
      0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20,
    ],

    outputRange: [
      "0deg",
      "360deg",
      "720deg",
      "1080deg",
      "1440deg",
      "1800deg",
      "2160deg",
      "2520deg",
      "2880deg",
      "3240deg",
      "3600deg",
      "3960deg",
      "4320deg",
      "4680deg",
      "5040deg",
      "5400deg",
      "5760deg",
      "6120deg",
      "6480deg",
      "6840deg",
      //"7200deg",
      casillaFinal,
    ],
    //extrapolate: "extended",
  });

  const Salir = () => {
    setCodigoGenerado(false);
    setModalCobrarPremioVisible(false);
  };

  /* React.useEffect(() => {
    //console.log("codigo generado game screen", codigoGenerado);
    //console.log(currentPrize?.type);
  }, [codigoGenerado]); */

  const checkIfSkullExpired = () => {
    const user_token = userState.token;
    const userId = userState.id;
    const url = `${BASE_URL}/users/${userId}`;

    let config = {
      method: "get",
      url: url,
      headers: {
        Authorization: `Bearer ${user_token}`,
      },
    };

    axios(config)
      .then((response) => {
        console.log("checkeo de si skull expiro", response.status);
        // console.log(userState.prize);
        if (response.status === 200) {
          const hasPrize = response.data.hasPrize;
          if (!hasPrize) {
            // la skull ha expirado
            storeData("user", {
              ...userState,
              prize: null,
            });
            // eliminar premio del estado de la app
            userDispatch(setPrizeForUser(null));

            // informar
            Toast.show(ResolveText("CalaveraExpirada"), {
              duaration: Toast.durations.LONG,
              position: Toast.positions.BOTTOM,
              shadow: true,
              animation: true,
              hideOnPress: true,
              delay: 0,
            });
          }
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };

  React.useEffect(() => {
    //console.log("codigo generado game screen", codigoGenerado);
    //console.log(currentPrize?.type);
    if (!NadaWon && !DoublePrizeWon && !JoyaWon && !TopUpBonusWon) {
      wheelValue.current.setValue(0);
    }
  }, [NadaWon, DoublePrizeWon, JoyaWon]);

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

  return (
    <Animated.View
      style={{ flex: 1, opacity: fadeAnim, backgroundColor: generalBgColor }}
    >
      <ImageBackground
        source={require("../../assets/images/degradado_general.png")}
        style={{
          width: "100%",
          height: "100%",
          flex: 1,
        }}
        transition={false}
      >
        {loadingUserDataDummyModalVisible ? (
          <Modal
            animationType="slide"
            transparent={true}
            visible={loadingUserDataDummyModalVisible}
            onRequestClose={() => setLoadingUserDataDummyModalVisible(false)}
          >
            <View
              style={{
                flex: 1,
                width: "100%",
                height: "100%",
                backgroundColor: "rgba(0,0,0,0)",
              }}
            >
              <LoadingUserDataDummyModal />
            </View>
          </Modal>
        ) : null}

        {/* al pinchar botón de premio (esquina superior derecha) */}

        {nadaDescriptionModalVisible ? (
          <Modal
            animationType="slide"
            transparent={true}
            visible={nadaDescriptionModalVisible}
            onRequestClose={() => setNadaDescriptionModalVisible(false)}
          >
            <LinearGradient
              colors={[generalBgColor, bgColorFinalGradient]}
              style={{ width: "100%", height: "100%" }}
            >
              <View
                style={{
                  flex: 1,
                  width: "100%",
                  height: "100%",
                  backgroundColor: generalBgColorTrans5,
                }}
              >
                <NadaDescriptionContentModal
                  navigation={navigation}
                  setModalVisible={setNadaDescriptionModalVisible}
                  userState={userState}
                  horasRestantes={horasRestantes}
                />
              </View>
            </LinearGradient>
          </Modal>
        ) : null}
        {modalCobrarPremioVisible ? ( //cobrar premio modal
          <Modal
            animationType="slide"
            transparent={true}
            visible={modalCobrarPremioVisible}
            onRequestClose={() => setModalCobrarPremioVisible(false)}
          >
            <LinearGradient
              colors={[generalBgColor, bgColorFinalGradient]}
              style={{ width: "100%", height: "100%" }}
            >
              <View
                style={{
                  flex: 1,
                  width: "100%",
                  height: "100%",
                  backgroundColor: generalBgColorTrans5,
                }}
              >
                <RootSiblingParent>
                  <CobrarPremioContent
                    navigation={navigation}
                    setModalVisible={setModalCobrarPremioVisible}
                    Salir={Salir}
                    setCodigoGenerado={setCodigoGenerado}
                    codigoGenerado={codigoGenerado}
                    horasRestantes={horasRestantes}
                    setPrizeCollectedError={setPrizeCollectedError}
                    setPrizePendingError={setPrizePendingError}
                    setPrizeInactiveError={setPrizeInactiveError}
                    setVerificationError={setVerificationError}
                  />
                </RootSiblingParent>
              </View>
            </LinearGradient>
          </Modal>
        ) : null}
        {animate ? (
          <Modal
            animationType="slide"
            transparent={true}
            visible={animate}
            onRequestClose={() => SetAnimate(false)}
          >
            <View
              style={{
                zIndex: 10,
                flex: 1,
                width: "100%",
                height: "100%",
              }}
            >
              <ConfettiCannon count={200} origin={{ x: -10, y: 0 }} />
            </View>
          </Modal>
        ) : null}

        {/* giras la ruleta y ganas cosas: aparecen modals */}

        {NadaWon ? (
          <Modal
            animationType="slide"
            transparent={true}
            visible={NadaWon}
            onRequestClose={() => setNadaWon(false)}
          >
            <LinearGradient
              colors={[generalBgColor, bgColorFinalGradient]}
              style={{
                width: "100%",
                height: "100%",
                flex: 1,
                alignItems: "center",
              }}
            >
              <View style={{ marginTop: 150 }}>
                {/*  <Image
                source={require("../../assets/images/home/calavera_roja.png")}
                style={{ width: 160, height: 180 }}
              /> */}
                <Image
                  source={require("../../assets/animaciones/calavera-roja.gif")}
                  style={{ width: 120, height: 140 }}
                />
              </View>
              <View
                style={{
                  width: width / 1.5,
                  justifyContent: "center",
                  alignItems: "center",
                  //marginTop: 10,
                }}
              >
                <TextBold
                  text={
                    userState?.idioma === "spa" ? "La Calavera" : "The Skull"
                  }
                  //text={ResolveText("nadaWonTitle")}
                  style={{
                    fontSize: 30,
                    color: "#01f9d2",
                    textTransform: "uppercase",
                    textAlign: "center",
                    //fontStyle: "italic",
                  }}
                />
                <Text style={{ marginTop: 30 }}>
                  <TextItalic
                    text={
                      userState?.idioma === "spa"
                        ? "Lo sentimos... Mala suerte esta vez. Inténtalo de nuevo en 24 horas o envía una recarga rápida con El Rayo para que puedas volver a probar tu suerte de inmediato."
                        : "Oops... bad luck this time. You can try again in 24 hours or send a quick recharge with The Lightning to try again right away!"
                    }
                    style={{
                      fontSize: 18,
                      color: "#01f9d2",
                      textAlign: "center",
                      fontWeight: "bold",
                    }}
                  />
                </Text>
              </View>

              <View style={{ marginTop: 30 }}>
                <LargeFlatButton
                  text={ResolveText("gotit")}
                  onPress={() => {
                    setNadaWon(false);
                  }}
                />
              </View>
            </LinearGradient>
          </Modal>
        ) : null}

        {TopUpBonusWon ? (
          <Modal
            animationType="slide"
            transparent={true}
            visible={TopUpBonusWon}
            onRequestClose={() => setTopUpBonusWon(false)}
          >
            <LinearGradient
              colors={[generalBgColor, bgColorFinalGradient]}
              style={{ width: "100%", height: "100%" }}
            >
              <View
                style={{
                  flex: 1,
                  width: "100%",
                  height: "100%",
                  backgroundColor: generalBgColorTrans5,
                }}
              >
                <TopUpBonusWonContentModal
                  navigation={navigation}
                  setModalVisible={setTopUpBonusWon}
                  userState={userState}
                />
              </View>
            </LinearGradient>
          </Modal>
        ) : null}

        {DoublePrizeWon ? (
          <Modal
            animationType="slide"
            transparent={true}
            visible={DoublePrizeWon}
            onRequestClose={() => setDoublePrizeWon(false)}
          >
            <LinearGradient
              colors={[generalBgColor, bgColorFinalGradient]}
              style={{ width: "100%", height: "100%" }}
            >
              <View
                style={{
                  flex: 1,
                  width: "100%",
                  height: "100%",
                  backgroundColor: generalBgColorTrans5,
                }}
              >
                <DoublePrizeWonContentModal
                  navigation={navigation}
                  setModalVisible={setDoublePrizeWon}
                  userState={userState}
                />
              </View>
            </LinearGradient>
          </Modal>
        ) : null}

        {JoyaWon ? (
          <Modal
            animationType="slide"
            transparent={true}
            visible={JoyaWon}
            onRequestClose={() => setJoyaWon(false)}
          >
            <LinearGradient
              colors={[generalBgColor, bgColorFinalGradient]}
              style={{ width: "100%", height: "100%" }}
            >
              <View
                style={{
                  flex: 1,
                  width: "100%",
                  height: "100%",
                  backgroundColor: generalBgColorTrans5,
                }}
              >
                <JoyaWonContentModal
                  navigation={navigation}
                  setModalVisible={setJoyaWon}
                  userState={userState}
                />
              </View>
            </LinearGradient>
          </Modal>
        ) : null}

        {/* caso particular: detectamos que el premio ha expirado. aparece modal */}

        {showExpiredPrize ? (
          <Modal
            animationType="slide"
            transparent={true}
            visible={showExpiredPrize}
            onRequestClose={() => interfaceDispatch(setShowExpiredPrize(false))}
          >
            <LinearGradient
              colors={[generalBgColor, bgColorFinalGradient]}
              style={{ width: "100%", height: "100%" }}
            >
              <View
                style={{
                  flex: 1,
                  width: "100%",
                  height: "100%",
                  backgroundColor: generalBgColorTrans5,
                }}
              >
                <PremioExpiradoContentModal
                  navigation={navigation}
                  userState={userState}
                />
              </View>
            </LinearGradient>
          </Modal>
        ) : null}

        {/* casos particulares: premio cobrado, fallido, en camino. lo marco según el estado de la recarga */}

        {hayPremioCobrado ? (
          <Modal
            animationType="slide"
            transparent={true}
            visible={hayPremioCobrado}
            onRequestClose={() =>
              nuevaRecargaDispatch(setHayPremioCobradoModal(false))
            }
          >
            <LinearGradient
              colors={[generalBgColor, bgColorFinalGradient]}
              style={{ width: "100%", height: "100%" }}
            >
              <View
                style={{
                  flex: 1,
                  width: "100%",
                  height: "100%",
                  backgroundColor: generalBgColorTrans5,
                }}
              >
                <PremioCobradoModal userState={userState} />
              </View>
            </LinearGradient>
          </Modal>
        ) : null}

        {hayPremioFallido ? (
          <Modal
            animationType="slide"
            transparent={true}
            visible={hayPremioFallido}
            onRequestClose={() =>
              nuevaRecargaDispatch(setHayPremioFallidoModal(false))
            }
          >
            <LinearGradient
              colors={[generalBgColor, bgColorFinalGradient]}
              style={{ width: "100%", height: "100%" }}
            >
              <View
                style={{
                  flex: 1,
                  width: "100%",
                  height: "100%",
                  backgroundColor: generalBgColorTrans5,
                }}
              >
                <PremioFallidoModal userState={userState} />
              </View>
            </LinearGradient>
          </Modal>
        ) : null}

        {premioEnCamino ? (
          <Modal
            animationType="slide"
            transparent={true}
            visible={premioEnCamino}
            onRequestClose={() => setPremioEnCamino(false)}
          >
            <LinearGradient
              colors={[generalBgColor, bgColorFinalGradient]}
              style={{ width: "100%", height: "100%" }}
            >
              <View
                style={{
                  flex: 1,
                  width: "100%",
                  height: "100%",
                  backgroundColor: "generalBgColorTrans5",
                }}
              >
                <PremioEnCaminoModal
                  setModalVisible={setPremioEnCamino}
                  userState={userState}
                />
              </View>
            </LinearGradient>
          </Modal>
        ) : null}

        {/* caso particular: premio acumulado/ el usuario ya tiene un premio (se marca aquí, al girar la ruleta)*/}

        {hasPrizeModal ? (
          <Modal
            animationType="slide"
            transparent={true}
            visible={hasPrizeModal}
            onRequestClose={() => setHasPrizeModal(false)}
          >
            <LinearGradient
              colors={[generalBgColor, bgColorFinalGradient]}
              style={{ width: "100%", height: "100%" }}
            >
              <View
                style={{
                  flex: 1,
                  width: "100%",
                  height: "100%",
                  backgroundColor: "generalBgColorTrans5",
                }}
              >
                <HasPrizeModal
                  setModalVisible={setHasPrizeModal}
                  userState={userState}
                />
              </View>
            </LinearGradient>
          </Modal>
        ) : null}

        {/* caso particular: el usuario tiene la "Nada" */}

        {hasSkullModal ? (
          <Modal
            animationType="slide"
            transparent={true}
            visible={hasSkullModal}
            onRequestClose={() => setHasSkullModal(false)}
          >
            <LinearGradient
              colors={[generalBgColor, bgColorFinalGradient]}
              style={{ width: "100%", height: "100%" }}
            >
              <View
                style={{
                  flex: 1,
                  width: "100%",
                  height: "100%",
                  backgroundColor: "generalBgColorTrans5",
                }}
              >
                <HasSkullModal
                  setModalVisible={setHasSkullModal}
                  userState={userState}
                  horasRestantes={horasRestantes}
                />
              </View>
            </LinearGradient>
          </Modal>
        ) : null}

        <View style={styles.containerGame}>
          <View
            key={1}
            style={{
              flexDirection: "row",
              justifyContent: "flex-end",
              width: "80%",
              //marginTop: -height / 15,
              zIndex: 1,
              position: "absolute",
              top: 90,

              //marginRight: width / 10,
            }}
          >
            <TouchableOpacity
              //activeOpacity={0.6}

              style={{
                backgroundColor: btPremioColor,
                width: width / 3.5,
                height: width / 3.5,
                borderRadius: width / 7,
                justifyContent: "center",
                alignItems: "center",
              }}
              onPress={() => {
                if (userState.prize !== null) {
                  // caso de presion del boton justo cuando esta en camino

                  if (
                    userState.prize.type != "Nada" &&
                    userState.prize.status === "pending"
                  ) {
                    setPremioEnCamino(true);
                  } else {
                    const currentTime = moment();
                    const expirationDate = moment(
                      userState.prize?.expirationDate
                    ).local();
                    const horas_restantes = expirationDate.diff(
                      currentTime,
                      "hours"
                    );
                    // actualizo horas respantes para mostrar
                    setHorasRestantes(horas_restantes);

                    if (userState.prize.type === "Nada") {
                      // tiene skull
                      setNadaDescriptionModalVisible(true);
                      checkIfSkullExpired();
                      // se elimina de la app si expiró
                    } else {
                      // tiene un premio
                      // mostrar modal
                      enMovimiento.current = false;
                      setModalCobrarPremioVisible(true);
                    }
                  }
                } else {
                  // no hay premio en la app
                  // informar
                  let toast = Toast.show(ResolveText("premioVacio"), {
                    duaration: Toast.durations.LONG,
                    position: Toast.positions.BOTTOM,
                    shadow: true,
                    animation: true,
                    hideOnPress: true,
                    delay: 0,
                  });
                }
              }}
            >
              <ImageConditional typeOfPrize={userState?.prize?.type} />
            </TouchableOpacity>
          </View>

          <View
            key={2}
            style={{
              position: "absolute",
              zIndex: 2,
              left: -height / 3.2,
              top: height / 6.4,
            }}
          >
            <ImageBackground
              // source={require("../../assets/images/home/fondo.png")}
              source={
                userState.prize != null
                  ? require("../../assets/images/home/fondo_gris.png")
                  : require("../../assets/images/home/fondo.png")
              }
              style={{
                width: height / 1.6,
                height: height / 1.6,
                justifyContent: "center",
                alignItems: "center",
              }}
              transition={false}
            >
              <View
                style={{
                  position: "absolute",
                  right: -6.4,
                  zIndex: 1,
                  //zIndex: 5
                }}
              >
                <TouchableWithoutFeedback
                  onPress={() => {
                    // test spin
                    // onPressWheel("selector");
                    // test spin

                    if (userState.prize == null) {
                      onPressWheel("selector");
                    } else {
                      // tiene premio o skull
                      verificarPremioActual();
                      if (userState.prize.type !== "Nada") {
                        // abrir modal de que tiene premio
                        setHasPrizeModal(true);
                      } else {
                        // tiene skull
                        // actualizar horas

                        const currentTime = moment();
                        const expirationDate = moment(
                          userState.prize?.expirationDate
                        ).local();
                        const horas_restantes = expirationDate.diff(
                          currentTime,
                          "hours"
                        );
                        // actualizo horas respantes para mostrar
                        setHorasRestantes(horas_restantes);

                        // abrir modal
                        setHasSkullModal(true);
                      }
                    }
                  }}
                >
                  <Image
                    source={
                      userState.prize != null
                        ? require("../../assets/images/home/selector_gris.png")
                        : require("../../assets/images/home/selector.png")
                    }
                    style={{ height: 95, width: 80 }}
                  />
                </TouchableWithoutFeedback>
              </View>
              <View
                style={{
                  position: "absolute",
                  top: height / 3.6,
                  zIndex: 1,

                  //right: 3,
                }}
              >
                <Image
                  source={
                    userState.prize != null
                      ? require("../../assets/images/home/centro_gris.png")
                      : require("../../assets/images/home/centro.png")
                  }
                  style={{
                    width: width / 5.2,
                    height: width / 5.2,
                  }}
                  transition={false}
                />
              </View>

              <ImageBackground
                source={
                  userState.prize != null
                    ? require("../../assets/images/home/bisel_gris.png")
                    : require("../../assets/images/home/bisel.png")
                }
                style={{
                  width: height / 2.1 + 8,
                  height: height / 2.1 + 8,
                  justifyContent: "center",
                  alignItems: "center",
                }}
                transition={false}
              >
                <TouchableWithoutFeedback
                  onPress={() => {
                    if (userState.prize == null) {
                      onPressWheel("slots");
                    } else {
                      // tiene premio o skull
                      verificarPremioActual();
                      if (userState.prize.type !== "Nada") {
                        // abrir modal de que tiene premio
                        setHasPrizeModal(true);
                      } else {
                        // tiene skull
                        // actualizar horas

                        const currentTime = moment();
                        const expirationDate = moment(
                          userState.prize?.expirationDate
                        ).local();
                        const horas_restantes = expirationDate.diff(
                          currentTime,
                          "hours"
                        );
                        // actualizo horas respantes para mostrar
                        setHorasRestantes(horas_restantes);

                        // abrir modal
                        setHasSkullModal(true);
                      }
                    }
                  }}
                >
                  <Image
                    source={
                      userState.prize != null
                        ? require("../../assets/images/home/sombra_gris.png")
                        : require("../../assets/images/home/sombra.png")
                    }
                    style={{
                      width: height / 2.1,
                      height: height / 2.1,
                      justifyContent: "center",
                      alignItems: "center",
                      zIndex: 1,
                      position: "absolute",
                      //top: 30,
                    }}
                    transition={false}
                  />
                </TouchableWithoutFeedback>

                <Animated.View
                  style={{
                    transform: [
                      //{ rotate: !thereIsPrizeResult ? wheelLoop : wheel },
                      { rotate: wheelLoop },
                    ],
                  }}
                >
                  <ImageBackground
                    source={
                      userState.prize != null
                        ? require("../../assets/images/home/ruleta/Mueve_slots_gris.png")
                        : require("../../assets/images/home/ruleta/Mueve_slots.png")
                    }
                    style={{
                      width: height / 2.1,
                      height: height / 2.1,
                      justifyContent: "center",
                      alignItems: "center",
                      //zIndex: 3,
                    }}
                    transition={false}
                  />
                </Animated.View>
              </ImageBackground>
            </ImageBackground>
          </View>

          {/*  <View style={{ height: 40, width: 100, backgroundColor: "pink" }}>
              <Button
                title="toggle socket"
                onPress={() => onPressToggleSocket()}
              />
            </View> */}
          <View
            key={3}
            style={{
              flexDirection: "row",
              justifyContent: "flex-end",
              //marginBottom: -height / 15,
              zIndex: 10,
              width: "80%",
              //backgroundColor: "pink",
              position: "absolute",
              bottom: 130,
            }}
          >
            <TouchableOpacity
              //activeOpacity={0.6}

              style={{
                backgroundColor: btPremioColor,
                width: width / 3.5,
                height: width / 3.5,
                borderRadius: width / 7,
                justifyContent: "center",
                alignItems: "center",
              }}
              onPress={() => {
                //const pushAction = StackActions.push("Nueva Recarga");
                //navigation.dispatch(pushAction);
                enMovimiento.current = false;

                navigation.jumpTo("Nueva Recarga", {
                  screen: "NuevaRecargaScreen",
                  params: { inOrderToCobrarPremio: false },
                });
              }}
            >
              <Image
                //source={require("../../assets/animaciones/moneda-recarga-rapida.gif")}
                source={require("../../assets/images/home/boton_recarga_directa.png")}
                //resizeMode="center"
                style={{
                  //width: 90,
                  //height: 110,
                  width: 160,
                  height: 160,
                }}
              />
            </TouchableOpacity>
          </View>
        </View>
      </ImageBackground>
    </Animated.View>
  );
};

export default GameScreen;

const styles = StyleSheet.create({
  containerGame: {
    flex: 1,
    width: width,
    height: height,
    alignItems: "center",
    justifyContent: "space-around",
  },

  title: {
    fontSize: 20,
    fontWeight: "bold",
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "flex-end",
    zIndex: 2,
  },
});
