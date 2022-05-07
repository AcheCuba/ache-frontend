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
} from "react-native";
import { NeuButton } from "react-native-neu-element";
import axios from "axios";
import { BASE_URL } from "../../constants/domain";
import { GlobalContext } from "../../context/GlobalProvider";
import {
  resetNuevaRecargaState,
  setPrizeForUser,
} from "../../context/Actions/actions";
import Toast from "react-native-root-toast";
import moment from "moment";
import * as SecureStore from "expo-secure-store";
import Constants from "expo-constants";
import * as Notifications from "expo-notifications";
import { getData, storeData } from "../../libs/asyncStorage.lib";
import {
  cancelNotification,
  scheduleNotificationAtSecondsFromNow,
  _setNotificationHandler,
} from "../../libs/expoPushNotification.lib";

import ConfettiCannon from "react-native-confetti-cannon";
import { Modal } from "react-native";
import CommonNeuButton from "../../components/CommonNeuButton";
import { Pressable } from "react-native";
import { RootSiblingParent } from "react-native-root-siblings";
import CobrarPremioContent from "./components/CobrarPremioContent";
import {
  GameScreenTextEnglish,
  GameScreenTextSpanish,
} from "../../constants/Texts";
import {
  TextBold,
  TextBoldItalic,
  TextItalic,
  TextMedium,
  TextNormal,
} from "../../components/CommonText";
import { LinearGradient } from "expo-linear-gradient";
import NadaDescriptionContentModal from "./components/NadaDescriptionContentModal";
import MediaBolsaWonContentModal from "./components/MediaBolsaWonContentModal";
import BolsaLlenaWonContentModal from "./components/BolsaLlenaWonContentModal";
import JoyaWonContentModal from "./components/JoyaWonContentModal";
import { Text } from "react-native";
import { getNetworkState } from "../../libs/networkState.lib";
import { Audio } from "expo-av";

const { width, height } = Dimensions.get("screen");

async function storeSacureValue(key, value) {
  await SecureStore.setItemAsync(key, value);
}

async function registerForPushNotificationsAsync() {
  let token;
  if (Constants.isDevice) {
    const { status: existingStatus } =
      await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;
    // console.log("final status", finalStatus);
    if (existingStatus !== "granted") {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }
    if (finalStatus !== "granted") {
      alert("Failed to get push token for push notification!");
      return;
    }
    token = (await Notifications.getExpoPushTokenAsync()).data;
    //console.log("expo push token", token);
  } else {
    alert("Must use physical device for Push Notifications");
  }

  return token;
}

const GameScreen = ({ navigation }) => {
  //const expoPushToken = useExpoPushToken();
  const [animate, SetAnimate] = React.useState(false);
  const [clickEvent, SetClickEvent] = React.useState(false);

  const [modalVisible, setModalVisible] = React.useState(false);
  //const [codigo, setCodigo] = React.useState("");
  const [codigoGenerado, setCodigoGenerado] = React.useState(false);

  const [premioAcumulado, setPremioAcumulado] = React.useState(false);
  const [premioAcumuladoType, setPremioAcumuladoType] =
    React.useState(undefined);
  const [premioAcumuladoAmount, setPremioAcumuladoAmount] =
    React.useState(undefined);
  const [NadaWon, setNadaWon] = React.useState(false);
  const [MediaBolsaWon, setMediaBolsaWon] = React.useState(false);
  const [BolsaLlenaWon, setBolsaLlenaWon] = React.useState(false);
  const [JoyaWon, setJoyaWon] = React.useState(false);

  const [horasRestantes, setHorasRestantes] = React.useState("24");

  const [nadaDescriptionModalVisible, setNadaDescriptionModalVisible] =
    React.useState(false);

  //sonidos
  const [soundError, setSoundError] = React.useState();
  const [soundGanasCalavera, setSoundGanasCalavera] = React.useState();
  const [soundGanasPremioDigital, setSoundGanasPremioDigital] =
    React.useState();
  const [soundGanasGranPremio, setSoundGanasGranPremio] = React.useState();

  const [casillaFinal, setCasillaFinal] = React.useState("7200deg");
  const thereIsPrizeResult = React.useRef(false);
  const { userState, userDispatch, nuevaRecargaDispatch } =
    React.useContext(GlobalContext);
  //const { socketDispatch, socketState } = React.useContext(GlobalContext);

  const wheelValue = React.useRef(new Animated.Value(0));
  const enMovimiento = React.useRef(false);

  const animationTime = 12000; // ms (movimiento de ruleta)

  /*  React.useEffect(() => {
    //console.log(width);
    //console.log(height);
    //console.log(JoyaWon);
    //console.log(userState);
    //console.log(width / 3);
  }); */

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
    async function expoTokenAsync() {
      let token;
      token = await SecureStore.getItemAsync("expo-push-token");
      //console.log("expo token del storage", token);

      if (token != null) {
        return;
      } else {
        registerForPushNotificationsAsync().then((token) => {
          if (token != undefined) {
            storeSacureValue("expo-push-token", token);
            setTokenRequest(token);
          }
        });
      }
    }
    expoTokenAsync();
  }, []);

  React.useEffect(() => {
    async function twoDaysOutOfTheApp() {
      const currentNotId = await getData("notification-two-days-out");

      const now = moment();
      const twoDaysLater = moment().add(2, "days");
      const seconds_diff = twoDaysLater.diff(now, "seconds");

      //console.log(seconds_diff);
      let notId;

      // si es sí, utilizar el value para cancelar notificación, crear otra con fecha actualizada, setear nuevo key
      if (currentNotId == null) {
        // schedule notif recuperar id
        notId = await scheduleNotificationAtSecondsFromNow(
          "Demasiado tiempo fuera",
          "Te tomará unos segundos lanzar la ruleta",
          seconds_diff
        );
        if (notId != undefined) {
          //console.log("notId", notId);
          // setear en async storage id
          await storeData("notification-two-days-out", notId);
        }
      } else {
        // cancel notificacion actual con ese id
        await cancelNotification(currentNotId);
        // crea una nueva, recupera el id
        notId = await scheduleNotificationAtSecondsFromNow(
          "Demasiado tiempo fuera",
          "Te tomará unos segundos lanzar la ruleta",
          seconds_diff
        );
        // sobreescribe el key notification-two-days-later
        if (notId != undefined) {
          await storeData("notification-two-days-out", notId);
        }
      }
    }
    twoDaysOutOfTheApp();
  }, []);

  const setPremioCercanoAExpirarNotification = async () => {
    const now = moment();
    const fechaLim = moment().add(2.5, "days");
    const seconds_diff = fechaLim.diff(now, "seconds");

    // console.log(seconds_diff);
    // crear notificación
    const notId = await scheduleNotificationAtSecondsFromNow(
      "Hey, no te descuides",
      "Tu premio expira en 12 horas",
      seconds_diff
    );
    // setear id en key "notification-prize-expire"
    if (notId != undefined) {
      storeData("notification-prize-expire", notId);
    }

    // se cancela
    // - cuando se cobra el premio por método normal
    // - cuando se hace exhange por código
  };

  const setTokenRequest = (expoPushToken) => {
    const user_token = userState.token;
    const url = `${BASE_URL}/auth/set-token/${expoPushToken}`;

    const config = {
      method: "post",
      url: url,
      headers: {
        Authorization: `Bearer ${user_token}`,
      },
    };

    axios(config)
      .then((response) => {
        //console.log("status in set-token", response.status);
        //console.log(response.data);
      })
      .catch((e) => {
        //console.log(e);
      });
  };

  const startAnimation = () => {
    SetAnimate(true);
    SetClickEvent(true);

    setTimeout(() => {
      SetAnimate(false);
    }, 5000);
  };

  const ImagePrizePremioAcumulado = () => {
    const typeOfPrize = premioAcumuladoType;
    const amount = premioAcumuladoAmount;

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
      case "TopUpBonus":
        //const amount = userState?.prize?.amount;

        if (amount === 10 || amount === 250) {
          return (
            <Image
              source={require("../../assets/images/home/premios_finales/Monedas_250_CUP.png")}
              style={{
                width: 105,
                height: 101,
              }}
            />
          );
        }
        if (amount === 20 || amount === 500) {
          return (
            <Image
              source={require("../../assets/images/home/premios_finales/Monedas_500_CUP.png")}
              style={{
                width: 105,
                height: 100,
              }}
            />
          );
        }

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
      case "TopUpBonus":
        const amount = userState?.prize?.amount;

        if (amount === 10 || amount === 250) {
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
        }
        if (amount === 20 || amount === 500) {
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
        }

      case "Nada":
        return (
          <View>
            <Image
              source={require("../../assets/animaciones/calavera-roja.gif")}
              //resizeMode="center"
              style={{
                width: 80,
                height: 90,
              }}
            />
          </View>
        );
      default:
        return (
          <View>
            <Image
              source={require("../../assets/images/home/logo_para_boton.png")}
              style={{
                width: 60,
                height: 60,
              }}
            />
          </View>
        );
    }
  };

  const setCasillaRandom = () => {
    // Para premio Acumulado
    const random_seed = Math.random();

    // menor que 0.25 - 3 posibles casillas (nada)
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

    // entre 0.25 y 0.5 - una posibilidad (jackpot)
    if (random_seed >= 0.25 && random_seed < 0.5) {
      setCasillaFinal("7223deg");
      setPremioAcumuladoType("Jackpot");
    }
    // entre 0.5 y 0.75 - 2 posibilidades (250 pesos)
    if (random_seed >= 0.5 && random_seed < 0.62) {
      setCasillaFinal("7268deg");
      setPremioAcumuladoType("TopUpBonus");
      setPremioAcumuladoAmount(250);
    }
    if (random_seed >= 0.62 && random_seed < 0.75) {
      setCasillaFinal("7358deg");
      setPremioAcumuladoType("TopUpBonus");
      setPremioAcumuladoAmount(250);
    }

    // entre 0.75 y 1 - 2 posibilidades (500 pesos)
    if (random_seed >= 0.75 && random_seed < 0.87) {
      setCasillaFinal("7178deg");
      setPremioAcumuladoType("TopUpBonus");
      setPremioAcumuladoAmount(500);
    }
    if (random_seed >= 0.87 && random_seed <= 1) {
      setCasillaFinal("7088deg");
      setPremioAcumuladoType("TopUpBonus");
      setPremioAcumuladoAmount(500);
    }
  };

  const setCasilla = (prize) => {
    //console.log("prize", prize);
    switch (prize.type) {
      case "Nada":
        setTimeout(() => {
          setNadaWon(true);
          playSoundGanasCalavera();
        }, animationTime);

        // pa que se vaya solo
        /*   setTimeout(() => {
          setNadaWon(true);
          setTimeout(() => {
            setNadaWon(false);
          }, 10000);
        }, 8000); */

        const random_seed = Math.random();
        //console.log(random_seed);

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
        }, animationTime);

        setTimeout(() => {
          setJoyaWon(true);
          playSoundGranPremio();
        }, animationTime + 6000);

        //setCasillaFinal("1823deg");
        setCasillaFinal("7223deg");

        break;
      case "TopUpBonus":
        if (prize.amount === 10 || prize.amount === 250) {
          //console.log("sellama");
          setTimeout(() => {
            setMediaBolsaWon(true);
            playSoundGanasPremioDigital();
          }, animationTime);
          //setCasillaFinal("1823deg");
          const random_seed = Math.random();
          //console.log(random_seed);

          if (random_seed < 0.5) {
            //setCasillaFinal("1868deg"); // ref 1800
            setCasillaFinal("7268deg");
          }
          if (random_seed >= 0.5) {
            //setCasillaFinal("1958deg");
            setCasillaFinal("7358deg");
          }
        }
        if (prize.amount === 20 || prize.amount === 500) {
          setTimeout(() => {
            setBolsaLlenaWon(true);
            playSoundGanasPremioDigital();
          }, animationTime);
          //setCasillaFinal("1778deg");
          const random_seed = Math.random();
          //console.log(random_seed);
          //console.log(prize.amount);

          if (random_seed < 0.5) {
            //setCasillaFinal("1778deg");
            setCasillaFinal("7178deg");
          }
          if (random_seed >= 0.5) {
            //setCasillaFinal("1688deg");
            setCasillaFinal("7088deg");
          }
        }
        break;

      default:
        //setCasillaFinal("1800deg");
        //setCasillaFinal("7200deg");
        setCasillaFinal("0deg");
        break;
    }
  };

  const onPressWheel = async () => {
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
      if (enMovimiento.current) {
        Toast.show("La ruleta ya está en movimiento. \n Por favor, espere.", {
          duaration: Toast.durations.SHORT,
          position: Toast.positions.BOTTOM,
        });
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

        // +++++++++++++++ fake para test

        /*  const fakePrize = { type: "Jackpot", amount: 250 };

        if (current_prize === null) {
          setCasilla(fakePrize);
          thereIsPrizeResult.current = true;

          setTimeout(() => {
            // demora del server simulacion

            const prizeStartTime = moment();
            const prizeEndTime = moment().add(3, "days");
            //const horas_restantes = prizeEndTime.diff(prizeStartTime, "hours");

            userDispatch(
              setPrizeForUser({
                type: "Jackpot",
                exchanged: false, // no se puede cambiar
                amount: 250,
                prizeStartTime,
                prizeEndTime,
                //minutos_restantes,
              })
            );
          }, animationTime);
        } else {
          setCasillaRandom();
          setTimeout(() => {
            thereIsPrizeResult.current = true;
            const currentTime = moment();
            const { prizeEndTime } = userState.prize;
            const horas_restantes = prizeEndTime.diff(currentTime, "hours");
            setHorasRestantes(horas_restantes);
            setPremioAcumulado(true);
          }, animationTime);
        } */

        // ++++++++++++++++ fake para test

        if (current_prize === null) {
          axios(config)
            .then((response) => {
              //console.log("data", response.data);
              //console.log(response.status, typeof response.status);
              const prize_result = response.data;
              thereIsPrizeResult.current = true;
              //console.log("prize", prize_result);
              //console.log(prize === ""); // true
              //console.log(JSON.stringify(response.data)); // ""

              if (prize_result === "" || prize_result === undefined) {
                setCasilla({ type: "Nada" });
                // time
                const prizeStartTime = moment();
                const prizeEndTime = moment().add(1, "days");
                const minutos_restantes = prizeEndTime.diff(
                  prizeStartTime,
                  "minutes"
                );

                //console.log(minutos_restantes);

                nuevaRecargaDispatch(resetNuevaRecargaState());

                setTimeout(() => {
                  //storeData({ ...userState, prize: null });
                  //userDispatch(set_prize(null));
                  storeData("user", {
                    ...userState,
                    prize: {
                      type: "Nada",
                      exchanged: false, // no se puede cambiar
                      prizeStartTime,
                      prizeEndTime,
                      minutos_restantes,
                    },
                  });
                  userDispatch(
                    setPrizeForUser({
                      type: "Nada",
                      exchanged: false, // no se puede cambiar
                      prizeStartTime,
                      prizeEndTime,
                      minutos_restantes,
                    })
                  );
                }, animationTime);
              } else {
                setCasilla(prize_result);

                // time
                const prizeStartTime = moment();
                const prizeEndTime = moment().add(3, "days");
                const minutos_restantes = prizeEndTime.diff(
                  prizeStartTime,
                  "minutes"
                );

                // console.log(minutos_restantes);
                nuevaRecargaDispatch(resetNuevaRecargaState());

                setTimeout(() => {
                  setPremioCercanoAExpirarNotification();

                  storeData("user", {
                    ...userState,
                    prize: {
                      ...prize_result,
                      prizeStartTime,
                      prizeEndTime,
                      minutos_restantes,
                    },
                  });
                  userDispatch(
                    setPrizeForUser({
                      ...prize_result,
                      prizeStartTime,
                      prizeEndTime,
                      minutos_restantes,
                    })
                  );
                }, animationTime);
              }
            })
            .catch((error) => {
              console.log(error.response);
              console.log("catch");
              thereIsPrizeResult.current = false;
              Toast.show(error.message, {
                duaration: Toast.durations.SHORT,
                position: Toast.positions.BOTTOM,
              });
            });
        } else {
          setCasillaRandom();
          thereIsPrizeResult.current = true;
          setTimeout(() => {
            const currentTime = moment();
            const prizeEndTime = moment(userState.prize?.prizeEndTime);
            const horas_restantes = prizeEndTime.diff(currentTime, "hours");
            setHorasRestantes(horas_restantes);
            setPremioAcumulado(true);
          }, animationTime);
        }
      }
    }
  };

  /* const wheelRotateInit = () => {
    console.log("init");
    enMovimiento.current = true;
    wheelValue.current.setValue(0);
    //console.log("init");
    Animated.timing(wheelValue.current, {
      toValue: 1,
      duration: 10000, //3000
      easing: Easing.in(Easing.linear), //Easing.in(Easing.cubic)
      useNativeDriver: true,
    }).start((complete) => {
      if (complete.finished) {
        wheelRotateLoop();
      }
    });
  }; */

  // 5 vueltas cada 3 segundos
  // para 12 segundos -> 20 vueltas

  const wheelRotateLoop = () => {
    wheelValue.current.setValue(0);
    enMovimiento.current = true;
    Animated.timing(wheelValue.current, {
      toValue: 20,
      duration: animationTime,
      easing: Easing.inOut(Easing.exp),
      //easing: Easing.inOut(Easing.ease),
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
        }
      }
    });
  };

  /* const wheelRotateFinal = () => {
    console.log("finish");

    //console.log(wheelValue);

    wheelValue.current.setValue(0);

    //centerValue.setValue(0);
    //console.log("final");
    Animated.timing(wheelValue.current, {
      toValue: 1,
      duration: 10000, //ultimo exitoso: 3200 //3000
      easing: Easing.out(Easing.linear), //Easing.out(Easing.ease)
      useNativeDriver: true,
    }).start((complete) => {
      if (complete.finished) {
        thereIsPrizeResult.current = false;
        enMovimiento.current = false;
      }
    });
  }; */

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
      casillaFinal,
    ],

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
    setModalVisible(false);
  };

  /* React.useEffect(() => {
    //console.log("codigo generado game screen", codigoGenerado);
    //console.log(currentPrize?.type);
  }, [codigoGenerado]); */

  React.useEffect(() => {
    //console.log("codigo generado game screen", codigoGenerado);
    //console.log(currentPrize?.type);
    if (
      !NadaWon &&
      !BolsaLlenaWon &&
      !MediaBolsaWon &&
      !JoyaWon &&
      !premioAcumulado
    ) {
      wheelValue.current.setValue(0);
    }
  }, [NadaWon, BolsaLlenaWon, MediaBolsaWon, JoyaWon, premioAcumulado]);

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
      source={require("../../assets/images/degradado_home.png")}
      style={{
        width: "100%",
        height: "100%",
        flex: 1,
      }}
      transition={false}
    >
      {nadaDescriptionModalVisible ? (
        <Modal
          animationType="slide"
          transparent={true}
          visible={nadaDescriptionModalVisible}
          onRequestClose={() => setNadaDescriptionModalVisible(false)}
        >
          <LinearGradient
            colors={["rgba(112, 28, 87,0.8)", "rgba(55,07,55,0.8)"]}
            style={{ width: "100%", height: "100%" }}
          >
            <View
              style={{
                flex: 1,
                width: "100%",
                height: "100%",
                backgroundColor: "rgba(112, 28, 87, 0.5)",
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
      {modalVisible ? ( //cobrar premio modal
        <Modal
          animationType="slide"
          transparent={true}
          visible={modalVisible}
          onRequestClose={() => setModalVisible(false)}
        >
          <LinearGradient
            colors={["rgba(112, 28, 87,0.8)", "rgba(55,07,55,0.8)"]}
            style={{ width: "100%", height: "100%" }}
          >
            <View
              style={{
                flex: 1,
                width: "100%",
                height: "100%",
                backgroundColor: "rgba(112, 28, 87, 0.5)",
              }}
            >
              <RootSiblingParent>
                <CobrarPremioContent
                  navigation={navigation}
                  setModalVisible={setModalVisible}
                  Salir={Salir}
                  setCodigoGenerado={setCodigoGenerado}
                  codigoGenerado={codigoGenerado}
                  horasRestantes={horasRestantes}
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
          <Pressable
            onPress={() => {
              setPremioAcumulado(false);
              setPremioAcumuladoType(undefined);
              setPremioAcumuladoAmount(undefined);
            }}
          >
            <LinearGradient
              colors={["rgba(112, 28, 87,0.9)", "rgba(55,07,55,0.9)"]}
              style={{ width: "100%", height: "100%" }}
            >
              <View
                style={{
                  // zIndex: 2,
                  flex: 1,
                  width: "100%",
                  height: "100%",
                  backgroundColor: "rgba(112, 28, 87, 0.3)",
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
                            : "Ruleta Bloqueada"
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
                            : "Premio Pendiente"
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
                            ? `Lo sentimos…tienes Calavera. Recupera tu ACHÉ en ${horasRestantes} horas, o envía una recarga y vuelve a jugar.`
                            : `Lo sentimos…tienes Calavera. Recupera tu ACHÉ en ${horasRestantes}  horas, o envía una recarga y vuelve a jugar.`
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
                            ? `El ACHÉ está lleno. Para ganar otro premio en la Ruleta, agrega tu premio pendiente a una recarga, o compártelo usando el botón ubicado en la esquina superior derecha de tu pantalla.`
                            : `El ACHÉ está lleno. Para ganar otro premio en la Ruleta, agrega tu premio pendiente a una recarga, o compártelo usando el botón ubicado en la esquina superior derecha de tu pantalla.`
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
                  <NeuButton
                    color="#5a1549"
                    width={(4 / 5) * width}
                    height={width / 7.5}
                    borderRadius={width / 7.5}
                    onPress={() => {
                      setPremioAcumulado(false);

                      if (userState.prize?.type !== "Nada") {
                        navigation.jumpTo("Nueva Recarga", {
                          screen: "NuevaRecargaScreen",
                          params: { inOrderToCobrarPremio: true },
                        });
                      }
                    }}
                    style={{}}
                  >
                    {userState.prize?.type === "Nada" ? (
                      <TextBold
                        text={ResolveText("cancelar")}
                        style={{
                          fontSize: 20,
                          color: "#fffb00",
                          textAlign: "center",
                          textTransform: "uppercase",
                        }}
                      />
                    ) : (
                      <TextBold
                        text={ResolveText("obtenerPremio")}
                        style={{
                          fontSize: 20,
                          color: "#fffb00",
                          textAlign: "center",
                          textTransform: "uppercase",
                        }}
                      />
                    )}
                  </NeuButton>
                </View>
              </View>
            </LinearGradient>
          </Pressable>
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
            colors={["rgba(112, 28, 87,0.9)", "rgba(55,07,55,0.9)"]}
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
                text={userState?.idioma === "spa" ? "Calavera" : "Calavera"}
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
                  text="Oh…lo sentimos, pero te faltó ACHÉ en el giro. Intenta otra vez en 24 horas o envía una recarga rápida con"
                  style={{
                    fontSize: 18,
                    color: "#01f9d2",
                    textAlign: "center",
                    fontWeight: "bold",
                  }}
                />
                <TextBoldItalic
                  text=" El Rayo "
                  style={{
                    fontSize: 18,
                    color: "#01f9d2",
                    textAlign: "center",
                    fontWeight: "bold",
                  }}
                />
                <TextItalic
                  text="para que desaparezca al instante. ¡Sigue probando!"
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
              <CommonNeuButton
                text={ResolveText("volverAJugar")}
                onPress={() => {
                  setNadaWon(false);
                }}
                screenWidth={width}
                color="#501243"
              />
            </View>
          </LinearGradient>
        </Modal>
      ) : null}
      {MediaBolsaWon ? (
        <Modal
          animationType="slide"
          transparent={true}
          visible={MediaBolsaWon}
          onRequestClose={() => setMediaBolsaWon(false)}
        >
          <LinearGradient
            colors={["rgba(112, 28, 87,0.8)", "rgba(55,07,55,0.8)"]}
            style={{ width: "100%", height: "100%" }}
          >
            <View
              style={{
                flex: 1,
                width: "100%",
                height: "100%",
                backgroundColor: "rgba(112, 28, 87, 0.5)",
              }}
            >
              <MediaBolsaWonContentModal
                navigation={navigation}
                setModalVisible={setMediaBolsaWon}
                userState={userState}
              />
            </View>
          </LinearGradient>
        </Modal>
      ) : null}
      {BolsaLlenaWon ? (
        <Modal
          animationType="slide"
          transparent={true}
          visible={BolsaLlenaWon}
          onRequestClose={() => setBolsaLlenaWon(false)}
        >
          <LinearGradient
            colors={["rgba(112, 28, 87,0.8)", "rgba(55,07,55,0.8)"]}
            style={{ width: "100%", height: "100%" }}
          >
            <View
              style={{
                flex: 1,
                width: "100%",
                height: "100%",
                backgroundColor: "rgba(112, 28, 87, 0.5)",
              }}
            >
              <BolsaLlenaWonContentModal
                navigation={navigation}
                setModalVisible={setBolsaLlenaWon}
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
            colors={["rgba(112, 28, 87,0.8)", "rgba(55,07,55,0.8)"]}
            style={{ width: "100%", height: "100%" }}
          >
            <View
              style={{
                flex: 1,
                width: "100%",
                height: "100%",
                backgroundColor: "rgba(112, 28, 87, 0.5)",
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

      <View style={styles.containerGame}>
        <View
          key={1}
          style={{
            flexDirection: "row",
            justifyContent: "flex-end",
            width: "80%",
            //backgroundColor: "red",
            //marginTop: -height / 15,
            zIndex: 1,
            position: "absolute",
            top: 90,

            //marginRight: width / 10,
          }}
        >
          <NeuButton
            color="#fe8457"
            width={width / 3.5}
            height={width / 3.5}
            borderRadius={width / 7}
            //noShadow

            onPress={() => {
              if (userState.prize !== null) {
                // actualizar horas restantes
                // tanto para nada como para los premios drntro del modal
                const currentTime = moment();
                const prizeEndTime = moment(userState.prize?.prizeEndTime);
                const horas_restantes = prizeEndTime.diff(currentTime, "hours");
                setHorasRestantes(horas_restantes);
                if (userState.prize.type === "Nada") {
                  setNadaDescriptionModalVisible(true);
                } else {
                  enMovimiento.current = false;

                  setModalVisible(true);
                }
              } else {
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
          </NeuButton>
        </View>
        {/*  <ImageBackground
          source={require("../../assets/images/home/ruleta/bordeysombra_sinluz.png")}
          style={{
            width: height / 0.9,
            height: height / 0.9,
            position: "absolute",
            left: -300,
            top: height / 6.4,
          }}
        /> */}
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
              <TouchableWithoutFeedback onPress={() => onPressWheel()}>
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
            {/* <View
              style={{
                justifyContent: "center",
                width: height / 1.6,
                height: height / 1.6,
                borderRadius: height / 3.2,
                position: "absolute",
                borderWidth: 3,
                borderColor: "black",
                zIndex: 1,
                //top: -height / (1.6 * 10),
              }}
            > 
            <TouchableWithoutFeedback onPress={() => onPressWheel()}>
              <View
                style={{
                  width: height / 1.6,
                  height: height / 1.6,
                  borderRadius: height / 3.2,
                  position: "absolute",
                  //top: -5,
                  //backgroundColor: "green",
                  borderWidth: 3,
                  //borderColor: "black",
                }}
              ></View>
            </TouchableWithoutFeedback> 
                  </View> */}

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
              <TouchableWithoutFeedback onPress={() => onPressWheel()}>
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
          <NeuButton
            color="#311338"
            width={width / 3.5}
            height={width / 3.5}
            borderRadius={width / 7}
            style={{ zIndex: 3 }}
            /*  onPress={() => {
                  navigation.jumpTo("Nueva Recarga", {
                    screen: "Nueva Recarga"
                  });
                }} */
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
              source={require("../../assets/animaciones/moneda-recarga-rapida.gif")}
              //source={require("../../assets/images/home/recarga_directa.png")}
              //resizeMode="center"
              style={{
                width: 90,
                height: 110,

                //width: 65,
                //height: 67,
              }}
            />
          </NeuButton>
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
