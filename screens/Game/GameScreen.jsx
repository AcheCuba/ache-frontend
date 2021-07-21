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
  Easing
} from "react-native";
import CustomButtom from "../../components/CustomButton";
import CobrarPremioModal from "./components/CobrarPremioModal";
import { NeuButton, NeuView } from "react-native-neu-element";
import axios from "axios";
import { BASE_URL } from "../../constants/domain";
import { GlobalContext } from "../../context/GlobalProvider";
import { setPrizeForUser } from "../../context/Actions/actions";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Toast from "react-native-simple-toast";
import moment from "moment";
import { StackActions, useNavigationState } from "@react-navigation/native";

//const user_token = `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6InRlc3QxIiwic3ViIjoxMTQsImlhdCI6MTYyMzIwMDQ1OX0.Nmm96Cam4SmoSGxmyxphAfbxqN70PP9fGSe2dRTInx4`;
//const base_url = "https://ache-backend.herokuapp.com";
const { width, height } = Dimensions.get("screen");

const GameScreen = ({ navigation }) => {
  const [modalVisible, setModalVisible] = React.useState(false);
  const [prizeLocal, setPrizeLocal] = React.useState(null);
  const [casillaFinal, setCasillaFinal] = React.useState("1800deg");
  //const [thereIsPrizeResult, setThereIsPrizeResult] = React.useState(false);

  const thereIsPrizeResult = React.useRef(false);

  const [stopAnimation, setStopAnimation] = React.useState(false);
  const { userState, userDispatch } = React.useContext(GlobalContext);

  //let wheelValue = new Animated.Value(0);
  //const wheelValue = React.useRef(new Animated.Value(0)).current;
  const wheelValue = React.useRef(new Animated.Value(0));
  const enMovimiento = React.useRef(false);

  const storeData = async (value) => {
    try {
      const jsonValue = JSON.stringify(value);
      await AsyncStorage.setItem("user", jsonValue);
    } catch (e) {
      // saving error
      console.log(e);
    }
  };

  /*  React.useEffect(() => {
    console.log("userStatae", userState);
  }, [userState]); */

  const ImageConditional = ({ typeOfPrize }) => {
    switch (typeOfPrize) {
      case "Jackpot":
        return (
          <Image
            source={require("../../assets/images/home/premios/diamanteCopia.png")}
            resizeMode="center"
            style={{
              width: width / 5,
              height: width / 5
            }}
          />
        );
      case "TopUpBonus":
        return (
          <Image
            source={require("../../assets/images/home/premios/capa102Copia.png")}
            resizeMode="center"
            style={{
              width: width / 5,
              height: width / 5
            }}
          />
        );
      case "Nada":
        return (
          <Image
            source={require("../../assets/images/home/premios/Nada2.png")}
            resizeMode="center"
          />
        );
      default:
        return null;
    }
  };

  const setCasilla = (prize) => {
    console.log("prize", prize);
    switch (prize.type) {
      case "Nada":
        setCasillaFinal("1733deg");
        break;
      case "Jackpot":
        setCasillaFinal("1868deg");
        break;
      case "TopUpBonus":
        if (prize.amount === 10 || prize.amount === 250) {
          setCasillaFinal("1823deg");
        }
        if (prize.amount === 20 || prize.amount === 500) {
          setCasillaFinal("1778deg");
        }
        break;
      default:
        setCasillaFinal("1800deg");
        break;
    }
  };

  const onPressWheel = async () => {
    if (enMovimiento.current) {
      Toast.show("Ruleta en movimiento, espere", Toast.SHORT);
    } else {
      wheelRotateInit();

      const current_prize = userState.prize;

      const user_token = userState.token;
      const url = `${BASE_URL}/prize/play`;

      const config = {
        method: "post",
        url: url,
        headers: {
          "Authorization": `Bearer ${user_token}`
        }
      };

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
              const prizeEndTime = moment().add(3, "days");
              const minutos_restantes = prizeEndTime.diff(
                prizeStartTime,
                "minutes"
              );

              console.log(minutos_restantes);

              setTimeout(() => {
                //storeData({ ...userState, prize: null });
                //userDispatch(set_prize(null));
                storeData({
                  ...userState,
                  prize: {
                    type: "Nada",
                    exchanged: false, // no se puede cambiar
                    prizeStartTime,
                    prizeEndTime,
                    minutos_restantes
                  }
                });
                userDispatch(
                  setPrizeForUser({
                    type: "Nada",
                    exchanged: false, // no se puede cambiar
                    prizeStartTime,
                    prizeEndTime,
                    minutos_restantes
                  })
                );
              }, 7000);
            } else {
              setCasilla(prize_result);

              // time
              const prizeStartTime = moment();
              const prizeEndTime = moment().add(3, "days");
              const minutos_restantes = prizeEndTime.diff(
                prizeStartTime,
                "minutes"
              );

              console.log(minutos_restantes);

              setTimeout(() => {
                storeData({
                  ...userState,
                  prize: {
                    ...prize_result,
                    prizeStartTime,
                    prizeEndTime,
                    minutos_restantes
                  }
                });
                userDispatch(
                  setPrizeForUser({
                    ...prize_result,
                    prizeStartTime,
                    prizeEndTime,
                    minutos_restantes
                  })
                );
              }, 7000);
            }
          })
          .catch((error) => {
            console.log(error);
            thereIsPrizeResult.current = true;
            Toast.show(error.message, Toast.SHORT);
          });
      } else {
        setTimeout(() => {
          thereIsPrizeResult.current = true;
          setCasilla({ type: "default" });
          Toast.show("Segundo Premio Ganado", Toast.SHORT);
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
      duration: 3000,
      easing: Easing.ease,
      useNativeDriver: true
    }).start((complete) => {
      if (complete.finished) {
        wheelRotateLoop();
      }
    });
  };

  const wheelRotateLoop = () => {
    wheelValue.current.setValue(0);

    console.log("loop", thereIsPrizeResult.current);
    Animated.timing(wheelValue.current, {
      toValue: 1,
      duration: 1800,
      easing: Easing.linear,
      useNativeDriver: true
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
      duration: 3000,
      easing: Easing.out(Easing.ease),
      useNativeDriver: true
    }).start((complete) => {
      if (complete.finished) {
        thereIsPrizeResult.current = false;
        enMovimiento.current = false;
      }
    });
  };

  const wheelLoop = wheelValue.current.interpolate({
    inputRange: [0, 0.2, 0.4, 0.6, 0.8, 1],
    outputRange: ["0deg", "360deg", "720deg", "1080deg", "1440deg", "1800deg"]
  });

  const wheel = wheelValue.current.interpolate({
    // Next, interpolate beginning and end values (in this case 0 and 1)
    inputRange: [0, 0.2, 0.4, 0.6, 0.8, 1],
    outputRange: [
      "0deg",
      "360deg",
      "720deg",
      "1080deg",
      "1440deg",
      casillaFinal
      //1800 complete
    ]
  });

  /*const center = centerValue.interpolate({
		inputRange: [0, 1],
		outputRange: ["0deg", "0deg"],
	});*/

  return (
    <>
      {modalVisible ? (
        <View style={styles.containerCobrar}>
          <CobrarPremioModal
            modalVisible={modalVisible}
            setModalVisible={setModalVisible}
            navigation={navigation}
          />
        </View>
      ) : (
        <ImageBackground
          source={require("../../assets/images/home/fondoOscuro.png")}
          style={{
            width: "100%",
            height: "100%",
            flex: 1
          }}
          transition={false}
        >
          <View style={styles.containerGame}>
            <View style={styles.buttonContainer} key={1}>
              <NeuButton
                color="#fe8457"
                width={width / 3.5}
                height={width / 3.5}
                borderRadius={width / 7}
                style={{ marginBottom: "90%" }}
                onPress={() => {
                  if (userState.prize !== null) {
                    if (userState.prize.type === "Nada") {
                      Toast.show("No ganaste nada, de momento", Toast.SHORT);
                    } else {
                      setModalVisible(true);
                    }
                  } else {
                    Toast.show(
                      "No tiene premio para cobrar, pruebe suerte!",
                      Toast.SHORT
                    );
                  }
                }}
              >
                {userState.prize !== null ? (
                  <ImageConditional typeOfPrize={userState.prize.type} />
                ) : null}
              </NeuButton>
            </View>
            <View
              key={2}
              style={{
                position: "absolute",
                left: -height / 3,
                top: height / 6
              }}
            >
              <ImageBackground
                source={require("../../assets/images/home/fondo.png")}
                style={{
                  width: height / 1.5,
                  height: height / 1.5,
                  justifyContent: "center",
                  alignItems: "center"
                }}
                transition={false}
              >
                <View
                  style={{
                    position: "absolute",
                    right: -6,
                    elevation: 2
                  }}
                >
                  <Image
                    source={require("../../assets/images/home/selecor.png")}
                    style={{ height: 105, width: 85 }}
                  />
                </View>

                <ImageBackground
                  source={require("../../assets/images/home/bisel.png")}
                  style={{
                    width: height / 2 + 10,
                    height: height / 2 + 10,
                    justifyContent: "center",
                    alignItems: "center"
                  }}
                  transition={false}
                >
                  <TouchableWithoutFeedback onPress={() => onPressWheel()}>
                    <Animated.View
                      style={{
                        transform: [
                          { rotate: !thereIsPrizeResult ? wheelLoop : wheel }
                        ]
                      }}
                    >
                      <ImageBackground
                        source={require("../../assets/images/home/casillas2.png")}
                        style={{
                          width: height / 2,
                          height: height / 2,
                          justifyContent: "center",
                          alignItems: "center"
                        }}
                        transition={false}
                      >
                        <View
                          style={{
                            elevation: 5
                            //position: "absolute",
                          }}
                        >
                          <Image
                            source={require("../../assets/images/home/centro.png")}
                            style={{
                              width: width / 5,
                              height: width / 5
                            }}
                            transition={false}
                          />
                        </View>
                      </ImageBackground>
                    </Animated.View>
                    {/*	<Image
												source={require("../../assets/images/home/centro.png")}
												style={{
													width: width / 5,
													height: width / 5,
													position: "absolute",
												}}
											/>*/}
                  </TouchableWithoutFeedback>
                </ImageBackground>
              </ImageBackground>
            </View>
            <View key={3} style={styles.buttonContainer}>
              <NeuButton
                color="#311338"
                width={width / 3.5}
                height={width / 3.5}
                borderRadius={width / 7}
                style={{ marginTop: "90%" }}
                /*  onPress={() => {
                  navigation.jumpTo("Nueva Recarga", {
                    screen: "Nueva Recarga"
                  });
                }} */
                onPress={() => {
                  //const pushAction = StackActions.push("Nueva Recarga");
                  //navigation.dispatch(pushAction);
                  navigation.jumpTo("Nueva Recarga", {
                    screen: "NuevaRecargaScreen"
                  });
                }}
              />
            </View>
          </View>
        </ImageBackground>
      )}
    </>
  );
};

export default GameScreen;

const styles = StyleSheet.create({
  containerGame: {
    flex: 1,
    alignItems: "center",
    justifyContent: "space-around"
  },
  containerCobrar: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center"
  },
  title: {
    fontSize: 20,
    fontWeight: "bold"
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "flex-end",
    width: "80%"
  }
});
