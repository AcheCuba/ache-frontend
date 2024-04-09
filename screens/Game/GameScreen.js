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
  setPrizeForUser,
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

const { width, height } = Dimensions.get("screen");

/* async function storeSacureValue(key, value) {
  await SecureStore.setItemAsync(key, value);
} */

const GameScreen = ({ navigation }) => {
  //const expoPushToken = useExpoPushToken();

  const [animate, SetAnimate] = React.useState(false);
  const [clickEvent, SetClickEvent] = React.useState(false);

  const [modalCobrarPremioVisible, setModalCobrarPremioVisible] =
    React.useState(false);
  //const [codigo, setCodigo] = React.useState("");
  const [codigoGenerado, setCodigoGenerado] = React.useState(false);

  const [premioAcumulado, setPremioAcumulado] = React.useState(false);
  const [premioAcumuladoType, setPremioAcumuladoType] =
    React.useState(undefined);

  const [NadaWon, setNadaWon] = React.useState(false);
  const [DoublePrizeWon, setDoublePrizeWon] = React.useState(false);
  const [JoyaWon, setJoyaWon] = React.useState(false);
  const [PremioExpirado, setPremioExpirado] = React.useState(false);

  const [horasRestantes, setHorasRestantes] = React.useState("24");

  const [nadaDescriptionModalVisible, setNadaDescriptionModalVisible] =
    React.useState(false);

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
  } = React.useContext(GlobalContext);
  //const { socketDispatch, socketState } = React.useContext(GlobalContext);

  const wheelValue = React.useRef(new Animated.Value(0));
  const enMovimiento = React.useRef(false);
  const ruletaSensible = React.useRef(true);

  //proporción que funciona  -> 7/4000 = 20/x -> x = aprox(12000)

  const ANIMATION_TIME = 10000; // ms (movimiento de ruleta)
  const SENSIBILITY_TIME = 4000; //mantener proporción con ANIMATION_TIME
  const TO_VALUE = 20;

  const { showExpiredPrize, showInvisibleLoadData } = interfaceState;

  /* React.useEffect(() => {
    console.log(userState);
  }, [userState]); */

  React.useEffect(() => {
    if (showInvisibleLoadData) {
      setLoadingUserDataDummyModalVisible(true);
      setTimeout(() => {
        setLoadingUserDataDummyModalVisible(false);
      }, 500);
    }
  }, [showInvisibleLoadData]);

  React.useState(() => {
    if (showExpiredPrize) {
      // mostrar al user que su premio ha expirado
      setPremioExpirado(true);
      // este estado no se limpia a false
    }
  }, [showExpiredPrize]);

  /*  React.useEffect(() => {
    if (
      userState.prize != null &&
      userState.prize?.type != "Nada" &&
      transactions_id_array.length != 0
    ) {
      console.log("GameScreen.js, ---transaccion en curso---");
      if (transacciones_premio_confirmadas.length != 0) {
        const uuidPremioEnApp = userState.prize.uuid;
        const premioEnApp = transacciones_premio_confirmadas.find(
          (transPrem) => transPrem.uuid === uuidPremioEnApp
        );

        if (premioEnApp) {
          console.log("--GameScreen.js--");
          console.log("--- Premio en App confirmado", premioEnApp);
          // se elimina el premio del storage
          storeData("user", { ...userState, prize: null });
          // se elimina el premio del estado de la app
          userDispatch(setPrizeForUser(null));
          // reset del estado de la recarga
          nuevaRecargaDispatch(resetNuevaRecargaState());
        } else {
          console.log("--- No se ha confirmado el premio de la app");
        }
      }
    }
    //const objetoEncontrado = arreglo.find(objeto => objeto.id === idABuscar);
  }, [transacciones_premio_confirmadas, userState, transactions_id_array]); */

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

  const ImagePrizePremioAcumulado = () => {
    const typeOfPrize = premioAcumuladoType;

    //console.log(typeOfPrize);
    //console.log(amount);

    switch (typeOfPrize) {
      case "Jackpot":
        return (
          <Image
            source={require("../../assets/images/home/premios_finales/Diamante_GRAN_PREMIO.png")}
            style={{
              width: 120,
              height: 100,
            }}
          />
        );
      case "DoublePrize":
        //const amount = userState?.prize?.amount;

        return (
          <Image
            source={require("../../assets/images/home/premios_finales/Monedas_250_CUP.png")}
            style={{
              width: 105,
              height: 100,
            }}
          />
        );

      case "Nada":
        return (
          <View>
            <Image
              source={require("../../assets/animaciones/calavera-roja.gif")}
              style={{ width: 120, height: 140 }}
            />
          </View>
        );
      default:
        return null;
    }
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
              //source={require("../../assets/animaciones/calavera-roja.gif")}
              //resizeMode="center"
              style={{
                width: 65,
                height: 75,

                //width: 80,
                //height: 90,
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

  const setCasillaRandom = () => {
    // Para premio Acumulado
    const random_seed = Math.random();
    // const random_seed = 0.1;

    // ======== menor que 0.25 - 3 posibles casillas (nada)
    if (random_seed < 0.08) {
      setCasillaFinal("7313deg");
      setPremioAcumuladoType("Nada");
    }
    if (random_seed >= 0.08 && random_seed < 0.16) {
      setCasillaFinal("7403deg");
      setPremioAcumuladoType("Nada");
    }

    if (random_seed >= 0.16 && random_seed < 0.25) {
      setCasillaFinal("7493deg");
      setPremioAcumuladoType("Nada");
    }

    // ====== entre 0.25 y 0.5 - una posibilidad (jackpot)
    if (random_seed >= 0.25 && random_seed < 0.5) {
      setCasillaFinal("7223deg");
      setPremioAcumuladoType("Jackpot");
    }

    // ======= mayor que 0.5 - 4 probabilidades (double prize)
    if (random_seed >= 0.5 && random_seed < 0.62) {
      setCasillaFinal("7268deg");
      setPremioAcumuladoType("DoublePrize");
    }
    if (random_seed >= 0.62 && random_seed < 0.75) {
      setCasillaFinal("7358deg");
      setPremioAcumuladoType("DoublePrize");
    }
    if (random_seed >= 0.75 && random_seed < 0.87) {
      setCasillaFinal("7178deg");
      setPremioAcumuladoType("DoublePrize");
    }
    if (random_seed >= 0.87 && random_seed <= 1) {
      setCasillaFinal("7088deg");
      setPremioAcumuladoType("DoublePrize");
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
        setCasillaFinal("7223deg");

        break;
      case "DoublePrize":
        //console.log("sellama");
        setTimeout(() => {
          setDoublePrizeWon(true);
          playSoundGanasPremioDigital();
        }, ANIMATION_TIME);
        //setCasillaFinal("1823deg");

        random_seed = Math.random();

        if (random_seed < 0.25) {
          //setCasillaFinal("1868deg"); // ref 1800
          setCasillaFinal("7268deg");
        }
        if (random_seed >= 0.25 && random_seed < 0.5) {
          //setCasillaFinal("1958deg");
          setCasillaFinal("7358deg");
        }
        if (random_seed >= 0.5 && random_seed < 0.75) {
          //setCasillaFinal("1778deg");
          setCasillaFinal("7178deg");
        }
        if (random_seed >= 0.75) {
          //setCasillaFinal("1688deg");
          setCasillaFinal("7088deg");
        }
        break;
      default:
        setCasillaFinal("7200deg");
        break;
    }
  };

  const onPressWheel = async (touchOn) => {
    const networkState = await getNetworkState();
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

        if (current_prize === null) {
          makePlayRequest(config);
        } else {
          // premio distinto de null

          const currentTime = moment();
          const expirationDate = moment(userState.prize?.expirationDate);

          const minutos_restantes = expirationDate.diff(currentTime, "minutes"); // para determinar si ha expirado
          const horas_restantes = expirationDate.diff(currentTime, "hours");

          //console.log(minutos_restantes);

          if (minutos_restantes < 0) {
            // el OBJETO ha expirado
            // se elimina la skull si era skull, y si tenia premio lo pierde

            storeData("user", {
              ...userState,
              prize: null,
            });
            userDispatch(setPrizeForUser(null));

            // luego de eliminado el objeto se trata la app como si el usuario no tuviese premio
            makePlayRequest(config);
          } else {
            // EL OBJETO no ha expirado
            setCasillaRandom();
            thereIsPrizeResult.current = true;
            console.log(horas_restantes);
            setHorasRestantes(horas_restantes);
            setTimeout(() => {
              setPremioAcumulado(true);
            }, ANIMATION_TIME);
          }
        }
      }
    }
  };

  const makePlayRequest = (config) => {
    axios(config)
      .then((response) => {
        const prize_result = response.data;
        console.log("PRIZE RESULT", prize_result);

        // probar premio falso para ver textos o whathever
        /* const prize_result = {
          type: "Nada",
          //type: "Jackpot",
          //type: "DoublePrize",
        };
 */
        thereIsPrizeResult.current = true;

        if (prize_result === "" || prize_result === undefined) {
          setCasilla({ type: "Nada" });
          // time
          //const prizeStartTime = moment();
          const expirationDate = moment().add(1, "days");

          //const expirationDate = moment().add(3, "minutes"); //test

          //console.log(minutos_restantes);

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
          setCasilla(prize_result);

          // time
          const prizeStartTime = moment();
          const expirationDate = moment(prize_result.expirationDate).local();
          //const expirationDate = moment().add(3, "days");
          //const expirationDate = moment().add(3, "minutes"); //test

          nuevaRecargaDispatch(resetNuevaRecargaState());

          setTimeout(() => {
            storeData("user", {
              ...userState,
              prize: {
                ...prize_result,
                expirationDate,
              },
            });
            userDispatch(
              setPrizeForUser({
                ...prize_result,
                expirationDate,
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

    /* inputRange: [0, 1],
    outputRange: ["0deg", casillaFinal],
    extrapolate: "clamp", */

    /* inputRange: [0, 0.2, 0.4, 0.6, 0.8, 1],
    outputRange: [
      "0deg",
      "360deg",
      "720deg",
      "1080deg",
      "1440deg",
      casillaFinal,
    ], */
  });

  /* const wheel = wheelValue.current.interpolate({
    // Next, interpolate beginning and end values (in this case 0 and 1)
    
    outputRange: [
      "0deg",
      "360deg",
      "720deg",
      "1080deg",
      "1440deg",
      casillaFinal,
      //1800 complete
    ],
  }); */

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
        //console.log("check skull", response.status);
        console.log(userState.prize);
        if (response.status === 200) {
          const hasPrize = response.data.hasPrize;
          if (!hasPrize) {
            // no tiene premio
            // o sea, no tiene skull
            storeData("user", {
              ...userState,
              prize: null,
            });
            // eliminar premio del estado de la app
            userDispatch(setPrizeForUser(null));
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
    if (!NadaWon && !DoublePrizeWon && !JoyaWon && !premioAcumulado) {
      wheelValue.current.setValue(0);
    }
  }, [NadaWon, DoublePrizeWon, JoyaWon, premioAcumulado]);

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

      {premioAcumulado ? (
        <Modal
          animationType="slide"
          transparent={true}
          visible={premioAcumulado}
          onRequestClose={() => setPremioAcumulado(false)}
        >
          <View
          /* onPress={() => {
              setPremioAcumulado(false);
              setPremioAcumuladoType(undefined); 
            }} */
          >
            <LinearGradient
              colors={[generalBgColor, bgColorFinalGradient]}
              style={{ width: "100%", height: "100%" }}
            >
              <View
                style={{
                  // zIndex: 2,
                  flex: 1,
                  width: "100%",
                  height: "100%",
                  backgroundColor: generalBgColorTrans5,
                  alignItems: "center",
                }}
              >
                <View style={{ marginTop: 150, height: 150 }}>
                  <ImagePrizePremioAcumulado />
                </View>
                <View
                  style={{
                    width: width / 1.5,
                    justifyContent: "center",
                    alignItems: "center",
                    //marginTop: -30,
                  }}
                >
                  <View style={{}}>
                    {userState.prize?.type === "Nada" ? (
                      <TextBold
                        text={
                          userState?.idioma === "spa"
                            ? "Ruleta Bloqueada"
                            : "WHEEL BLOCKED"
                        }
                        style={{
                          fontSize: 26,
                          color: "#01f9d2",
                          textTransform: "uppercase",
                        }}
                      />
                    ) : (
                      <TextBold
                        text={
                          userState?.idioma === "spa"
                            ? "Premio Pendiente"
                            : "PRIZE ON HOLD"
                        }
                        style={{
                          fontSize: 26,
                          color: "#01f9d2",
                          textTransform: "uppercase",
                        }}
                      />
                    )}
                  </View>

                  <View style={{ marginTop: 30 }}>
                    {userState.prize?.type === "Nada" ? (
                      <TextItalic
                        text={
                          userState?.idioma === "spa"
                            ? `lo sentimos... tienes calavera. Espera ${horasRestantes} horas para que se elimine o envía una recarga y vuelve a jugar`
                            : `sorry... you have the skull. Wait ${horasRestantes} hours for it to go away on its own or send a recharge and play again`
                        }
                        style={{
                          fontSize: 20,
                          color: "#01f9d2",
                          textAlign: "center",
                          //textTransform: "uppercase",
                        }}
                      />
                    ) : (
                      <TextItalic
                        text={
                          userState?.idioma === "spa"
                            ? "Ya tienes un premio guardado. Para poder cobrar otro premio que ganes en la ruleta debes agregar el premio actual a una recarga o compartirlo usando el botón de la esquina superior derecha de la pantalla."
                            : "You already have a saved prize. To be able to collect another prize from the fortune wheel add the existing one to a top up or share it using the icon on the top right corner of the screen."
                        }
                        style={{
                          fontSize: 20,
                          color: "#01f9d2",
                          textAlign: "center",
                          //textTransform: "uppercase",
                        }}
                      />
                    )}
                  </View>
                </View>

                <View style={{ marginTop: 30 }}>
                  {userState.prize?.type !== "Nada" ? (
                    <LargeFlatButton
                      text={ResolveText("obtenerPremio")}
                      btStyle={{ marginBottom: 30 }}
                      onPress={() => {
                        setPremioAcumulado(false);
                        if (userState.prize?.type !== "Nada") {
                          navigation.jumpTo("Nueva Recarga", {
                            screen: "NuevaRecargaScreen",
                            params: { inOrderToCobrarPremio: true },
                          });
                        }
                      }}
                    />
                  ) : null}

                  <LargeFlatButton
                    onPress={() => {
                      setPremioAcumulado(false);
                    }}
                    text={ResolveText("cancelar")}
                  />
                </View>
              </View>
            </LinearGradient>
          </View>
        </Modal>
      ) : null}

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
                text={userState?.idioma === "spa" ? "La Calavera" : "The Skull"}
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
                text={ResolveText("volverAJugar")}
                onPress={() => {
                  setNadaWon(false);
                }}
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

      {PremioExpirado ? (
        <Modal
          animationType="slide"
          transparent={true}
          visible={PremioExpirado}
          onRequestClose={() => setPremioExpirado(false)}
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
                setModalVisible={setPremioExpirado}
                userState={userState}
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
                // actualizar horas restantes
                // tanto para nada como para los premios drntro del modal
                const currentTime = moment();
                const expirationDate = moment(userState.prize?.expirationDate);
                const horas_restantes = expirationDate.diff(
                  currentTime,
                  "hours"
                );

                const minutos_restantes = expirationDate.diff(
                  currentTime,
                  "minutes"
                );

                //console.log(segundos_restantes);
                //console.log(minutos_restantes);

                if (minutos_restantes < 0) {
                  // ---- el premio ha expirado

                  // ---- si es nada: Toast de que ya puedes jugar
                  if (userState.prize.type === "Nada") {
                    Toast.show(ResolveText("CalaveraExpirada"), {
                      duaration: Toast.durations.LONG,
                      position: Toast.positions.BOTTOM,
                      shadow: true,
                      animation: true,
                      hideOnPress: true,
                      delay: 0,
                    });
                  } else {
                    // ---- era un premio, MODAL de que ha EXPIRADO
                    // abrir modal
                    setPremioExpirado(true);
                  }

                  // ---- siendo nada o premio lo que expiró...
                  // ---- eliminar del storage
                  storeData("user", {
                    ...userState,
                    prize: null,
                  });
                  // ---- eliminar premio del estado de la app
                  userDispatch(setPrizeForUser(null));
                } else {
                  // ---- el premio (o la skull) no ha expirado
                  // flujo normal
                  setHorasRestantes(horas_restantes);
                  if (userState.prize.type === "Nada") {
                    setNadaDescriptionModalVisible(true);
                    checkIfSkullExpired();
                  } else {
                    enMovimiento.current = false;
                    setModalCobrarPremioVisible(true);
                  }
                }
              } else {
                // ---- no hay premio en la app
                // ---- informar
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
            source={require("../../assets/images/home/fondo.png")}
            //source={require("../../assets/images/home/ruleta/bordeysombra_sinluz.png")}
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
                onPress={() => onPressWheel("selector")}
              >
                <Image
                  source={require("../../assets/images/home/selector.png")}
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
                source={require("../../assets/images/home/centro.png")}
                style={{
                  width: width / 5.2,
                  height: width / 5.2,
                }}
                transition={false}
              />
            </View>

            <ImageBackground
              source={require("../../assets/images/home/bisel.png")}
              style={{
                width: height / 2.1 + 8,
                height: height / 2.1 + 8,
                justifyContent: "center",
                alignItems: "center",
              }}
              transition={false}
            >
              <TouchableWithoutFeedback onPress={() => onPressWheel("slots")}>
                <Image
                  source={require("../../assets/images/home/sombra.png")}
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
                  //source={require("../../assets/images/home/casillas2.png")}
                  source={require("../../assets/images/home/ruleta/Mueve_slots.png")}
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
  /*   containerCobrar: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  }, */
  title: {
    fontSize: 20,
    fontWeight: "bold",
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "flex-end",
    zIndex: 2,
    //width: width / 3.5, //"80%",
    //height: width / 3.5,
  },
});

// onPressWheel function - para testear

/*  const fakePrize = { type: "Jackpot", amount: 250 };

        if (current_prize === null) {
          setCasilla(fakePrize);
          thereIsPrizeResult.current = true;

          setTimeout(() => {
            // demora del server simulacion

            const prizeStartTime = moment();
            const expirationDate = moment().add(3, "days");
            //const horas_restantes = expirationDate.diff(prizeStartTime, "hours");

            userDispatch(
              setPrizeForUser({
                type: "Jackpot",
                exchanged: false, // no se puede cambiar
                amount: 250,
                prizeStartTime,
                expirationDate,
                //minutos_restantes,
              })
            );
          }, ANIMATION_TIME);
        } else {
          setCasillaRandom();
          setTimeout(() => {
            thereIsPrizeResult.current = true;
            const currentTime = moment();
            const { expirationDate } = userState.prize;
            const horas_restantes = expirationDate.diff(currentTime, "hours");
            setHorasRestantes(horas_restantes);
            setPremioAcumulado(true);
          }, ANIMATION_TIME);
        } */
