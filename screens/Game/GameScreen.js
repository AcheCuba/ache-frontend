import * as React from "react";
import {
  Button,
  StyleSheet,
  Text,
  View,
  Dimensions,
  ImageBackground,
  Image,
  TouchableWithoutFeedback,
  Animated,
  Easing,
} from "react-native";
import CobrarPremioModal from "./components/CobrarPremioModal";
import { NeuButton } from "react-native-neu-element";
import axios from "axios";
import { BASE_URL } from "../../constants/domain";
import { GlobalContext } from "../../context/GlobalProvider";
import {
  closeSocket,
  openSocket,
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
import { TouchableOpacity } from "react-native";
import { RootSiblingParent } from "react-native-root-siblings";
import CobrarPremioContent from "./components/CobrarPremioContent";
import {
  NuevaRecargaTextEnglish,
  NuevaRecargaTextSpanish,
} from "../../constants/Texts";
import { TextBold, TextItalic } from "../../components/CommonText";
import { LinearGradient } from "expo-linear-gradient";

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
    console.log("expo push token", token);
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
  const [NadaWon, setNadaWon] = React.useState(false);
  const [codigo, setCodigo] = React.useState("");
  const [codigoGenerado, setCodigoGenerado] = React.useState(false);
  const [premioAcumulado, setPremioAcumulado] = React.useState(false);

  const [casillaFinal, setCasillaFinal] = React.useState("1800deg");
  const thereIsPrizeResult = React.useRef(false);
  const { userState, userDispatch, nuevaRecargaDispatch } =
    React.useContext(GlobalContext);
  //const { socketDispatch, socketState } = React.useContext(GlobalContext);

  const wheelValue = React.useRef(new Animated.Value(0));
  const enMovimiento = React.useRef(false);

  React.useEffect(() => {
    async function expoTokenAsync() {
      let token;
      token = await SecureStore.getItemAsync("expo-push-token");
      console.log("expo token del storage", token);

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
          console.log("notId", notId);
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

    console.log(seconds_diff);
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
        console.log("status in set-token", response.status);
        console.log(response.data);
      })
      .catch((e) => {
        console.log(e);
      });
  };

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
      case "TopUpBonus":
        return (
          <Image
            source={require("../../assets/animaciones/TROFEO.gif")}
            //resizeMode="center"
            style={{
              width: 95, //width / 3,
              height: 115, //width / 3,
            }}
          />
        );

      case "Nada":
        return (
          <View>
            <Image
              source={require("../../assets/animaciones/calavera_roja.gif")}
              //resizeMode="center"
              style={{
                width: 100,
                height: 100,
              }}
            />
          </View>
        );
      default:
        return (
          <View>
            <Image
              source={require("../../assets/images/home/trofeo.png")}
              //resizeMode="center"
              style={{
                width: 65, //width / 3.5,
                height: 80, //width / 2.9,
                //marginBottom: 30,
              }}
            />
          </View>
        );
    }
  };

  const setCasilla = (prize) => {
    //console.log("prize", prize);
    switch (prize.type) {
      case "Nada":
        setTimeout(() => {
          setNadaWon(true);
        }, 8000);

        // pa que se vaya solo
        /*   setTimeout(() => {
          setNadaWon(true);
          setTimeout(() => {
            setNadaWon(false);
          }, 10000);
        }, 8000); */
        const random_seed = Math.random();
        console.log(random_seed);

        if (random_seed < 0.33) {
          setCasillaFinal("1913deg");
        }
        if (random_seed >= 0.33 && random_seed < 0.66) {
          setCasillaFinal("2003deg");
        }
        if (random_seed >= 0.66) {
          setCasillaFinal("2093deg");
        }
        break;
      case "Jackpot":
        setTimeout(() => {
          startAnimation();
        }, 7000);

        setCasillaFinal("1823deg");
        break;
      case "TopUpBonus":
        if (prize.amount === 10 || prize.amount === 250) {
          //setCasillaFinal("1823deg");
          const random_seed = Math.random();
          console.log(random_seed);

          if (random_seed < 0.5) {
            setCasillaFinal("1868deg");
          }
          if (random_seed >= 0.5) {
            setCasillaFinal("1958deg");
          }
        }
        if (prize.amount === 20 || prize.amount === 500) {
          //setCasillaFinal("1778deg");
          const random_seed = Math.random();
          console.log(random_seed);
          console.log(prize.amount);

          if (random_seed < 0.5) {
            setCasillaFinal("1778deg");
          }
          if (random_seed >= 0.5) {
            setCasillaFinal("1688deg");
          }
        }
        break;
      default:
        setCasillaFinal("1800deg");
        break;
    }
  };

  const onPressWheel = async () => {
    if (enMovimiento.current) {
      Toast.show("Ruleta en movimiento, espere", {
        duaration: Toast.durations.SHORT,
        position: Toast.positions.BOTTOM,
      });
    } else {
      wheelRotateInit();

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

      /* const fakePrize = { type: "TopUpBonus", amount: 500 };

      setCasilla(fakePrize);
      thereIsPrizeResult.current = true;

      setTimeout(() => {
        userDispatch(
          setPrizeForUser({
            type: "TopUpBonus",
            exchanged: false, // no se puede cambiar
            amount: 500,
            //prizeStartTime,
            //prizeEndTime,
            //minutos_restantes,
          })
        );
      }, 8000); */

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
              }, 8000);
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
              }, 8000);
            }
          })
          .catch((error) => {
            console.log(error);
            thereIsPrizeResult.current = true;
            Toast.show(error.message, {
              duaration: Toast.durations.SHORT,
              position: Toast.positions.BOTTOM,
            });
          });
      } else {
        setTimeout(() => {
          thereIsPrizeResult.current = true;
          setCasilla({ type: "default" });

          setPremioAcumulado(true);
        }, 7500);
      }
    }
  };

  const wheelRotateInit = () => {
    enMovimiento.current = true;
    wheelValue.current.setValue(0);
    console.log("init");
    Animated.timing(wheelValue.current, {
      toValue: 1,
      duration: 3000, //ultimo exitoso: 3200 //3000
      easing: Easing.in(Easing.cubic), //Easing.in(Easing.cubic)
      useNativeDriver: true,
    }).start((complete) => {
      if (complete.finished) {
        wheelRotateLoop();
      }
    });
  };

  const wheelRotateLoop = () => {
    wheelValue.current.setValue(0);

    console.log("loop");
    Animated.timing(wheelValue.current, {
      toValue: 1,
      duration: 1600, ////ultimo exitoso: 1800 //1800
      easing: Easing.linear, //Easing.linear
      useNativeDriver: true,
    }).start((complete) => {
      if (complete.finished) {
        if (!thereIsPrizeResult.current) {
          wheelRotateLoop();
        } else {
          wheelRotateFinal();
        }
      }
    });
  };

  const wheelRotateFinal = () => {
    wheelValue.current.setValue(0);

    //centerValue.setValue(0);
    console.log("final");
    Animated.timing(wheelValue.current, {
      toValue: 1,
      duration: 3000, //ultimo exitoso: 3200 //3000
      easing: Easing.out(Easing.cubic), //Easing.out(Easing.ease)
      useNativeDriver: true,
    }).start((complete) => {
      if (complete.finished) {
        thereIsPrizeResult.current = false;
        enMovimiento.current = false;
      }
    });
  };

  const wheelLoop = wheelValue.current.interpolate({
    inputRange: [0, 0.16, 0.32, 0.48, 0.64, 0.8, 1],
    outputRange: [
      "0deg",
      "60deg",
      "120deg",
      "180deg",
      "240deg",
      "300deg",
      "360deg",
    ],
    //outputRange: ["0deg", "360deg", "720deg", "1080deg", "1440deg", "1800deg"],
  });

  const wheel = wheelValue.current.interpolate({
    // Next, interpolate beginning and end values (in this case 0 and 1)
    inputRange: [0, 0.2, 0.4, 0.6, 0.8, 1],
    //inputRange: [0, 0.16, 0.32, 0.48, 0.64, 0.8, 1],
    /*  outputRange: [
      "0deg",
      "60deg",
      "120deg",
      "180deg",
      "240deg",
      "300deg",
      casillaFinal,
    ], */
    outputRange: [
      "0deg",
      "360deg",
      "720deg",
      "1080deg",
      "1440deg",
      casillaFinal,
      //1800 complete
    ],
  });

  const Salir = () => {
    setCodigoGenerado(false);
    setModalVisible(false);
  };

  React.useEffect(() => {
    console.log("codigo generado game screen", codigoGenerado);
    //console.log(currentPrize?.type);
  }, [codigoGenerado]);

  const ResolveText = (site) => {
    const idioma = userState?.idioma;
    const textSpa = NuevaRecargaTextSpanish();
    const textEng = NuevaRecargaTextEnglish();

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
      {modalVisible ? (
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
                  setCodigo={setCodigo}
                  Salir={Salir}
                  setCodigoGenerado={setCodigoGenerado}
                  codigoGenerado={codigoGenerado}
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
                <View style={{ marginTop: 100 }}>
                  <Image
                    source={require("../../assets/animaciones/TROFEO.gif")}
                    style={{ width: width / 1.5, height: width / 1.5 }}
                  />
                </View>
                <View
                  style={{
                    width: width / 1.5,
                    justifyContent: "center",
                    alignItems: "center",
                    //marginTop: -30,
                  }}
                >
                  <View style={{ marginTop: 20 }}>
                    <TextBold
                      text="Premio acumulado"
                      style={{
                        fontSize: 26,
                        color: "#01f9d2",
                        textTransform: "uppercase",
                      }}
                    />
                  </View>

                  <View style={{ marginTop: 20 }}>
                    <TextItalic
                      text="Texto explicativo que no puedes seguir acumulando premios hasta que no reclames el que ya tienes acumulado"
                      style={{
                        fontSize: 20,
                        color: "#01f9d2",
                        textAlign: "center",
                        //textTransform: "uppercase",
                      }}
                    />
                  </View>
                </View>

                <View style={{ marginTop: 50 }}>
                  <NeuButton
                    color="#501a46"
                    width={(4 / 5) * width}
                    height={width / 7.5}
                    borderRadius={width / 7.5}
                    onPress={() => {
                      setPremioAcumulado(false);
                      navigation.jumpTo("Nueva Recarga", {
                        screen: "NuevaRecargaScreen",
                        params: { inOrderToCobrarPremio: true },
                      });
                    }}
                    style={{}}
                  >
                    <TextBold
                      text="Obtener Premio"
                      style={{
                        fontSize: 20,
                        color: "#fffb00",
                        textAlign: "center",
                        textTransform: "uppercase",
                      }}
                    />
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
            <View style={{ marginTop: 100 }}>
              <Image
                source={require("../../assets/animaciones/calavera_roja.gif")}
                style={{ width: width / 1.2, height: width / 1.2 }}
              />
            </View>
            <View
              style={{
                width: width / 1.5,
                justifyContent: "center",
                alignItems: "center",
                marginTop: -30,
              }}
            >
              <Text
                style={{
                  fontSize: 20,
                  fontWeight: "bold",
                  color: "#01f9d2",
                  textTransform: "uppercase",
                  textAlign: "center",
                }}
              >
                Texto que te anima a volver a jugar
              </Text>
            </View>

            <View style={{ marginTop: 50 }}>
              <CommonNeuButton
                text="Volver a Jugar"
                onPress={() => {
                  setNadaWon(false);
                }}
                screenWidth={width}
                color="#3f143d"
              />
            </View>
          </LinearGradient>
        </Modal>
      ) : null}

      <View style={styles.containerGame}>
        <View
          style={{
            flexDirection: "row",
            justifyContent: "flex-end",
            width: "80%",
            //backgroundColor: "green",
            marginBottom: height / 5,
            zIndex: 10,

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
                if (userState.prize.type === "Nada") {
                  Toast.show("No ganaste nada por el momento", {
                    duaration: Toast.durations.SHORT,
                    position: Toast.positions.BOTTOM,
                  });
                } else {
                  enMovimiento.current = false;

                  setModalVisible(true);
                }
              } else {
                let toast = Toast.show(
                  "No tiene premio para cobrar, pruebe suerte!",
                  {
                    duaration: Toast.durations.LONG,
                    position: Toast.positions.BOTTOM,
                    shadow: true,
                    animation: true,
                    hideOnPress: true,
                    delay: 0,
                  }
                );
              }
            }}
          >
            <ImageConditional typeOfPrize={userState?.prize?.type} />
          </NeuButton>
        </View>

        <View
          key={2}
          style={{
            position: "absolute",
            left: -height / 3.2,
            top: height / 6.4,
          }}
        >
          <ImageBackground
            source={require("../../assets/images/home/fondo.png")}
            //source={require("../../assets/images/home/ruleta/Fijo_borde_y_sombra.png")}
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
                zIndex: 2,
              }}
            >
              <Image
                source={require("../../assets/images/home/selecor.png")}
                style={{ height: 95, width: 80 }}
              />
            </View>
            <View
              style={{
                zIndex: 5,
                position: "absolute",
                top: height / 3.6,
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
              <TouchableWithoutFeedback onPress={() => onPressWheel()}>
                <Image
                  source={require("../../assets/images/home/sombra.png")}
                  style={{
                    width: height / 2.1,
                    height: height / 2.1,
                    justifyContent: "center",
                    alignItems: "center",
                    zIndex: 4,
                    position: "absolute",
                    //top: 30,
                  }}
                  transition={false}
                />
              </TouchableWithoutFeedback>

              <Animated.View
                style={{
                  transform: [
                    { rotate: !thereIsPrizeResult ? wheelLoop : wheel },
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
                    zIndex: 3,
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
            marginTop: height / 5,
            zIndex: 10,
            width: "80%",
            //backgroundColor: "pink",
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
              //resizeMode="center"
              style={{
                width: 95, //width / 4,
                height: 115, //width / 4,
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
