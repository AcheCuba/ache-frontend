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
import { set_prize } from "../../context/Actions/actions";
import { ToastAndroid } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

//const user_token = `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6InRlc3QxIiwic3ViIjoxMTQsImlhdCI6MTYyMzIwMDQ1OX0.Nmm96Cam4SmoSGxmyxphAfbxqN70PP9fGSe2dRTInx4`;
//const base_url = "https://ache-backend.herokuapp.com";
const { width, height } = Dimensions.get("screen");

const GameScreen = ({ navigation }) => {
  const [modalVisible, setModalVisible] = React.useState(false);
  const [prizeLocal, setPrizeLocal] = React.useState(null);
  const [casillaFinal, setCasillaFinal] = React.useState("1800deg");

  const [stopAnimation, setStopAnumation] = React.useState(false);
  const { userState, userDispatch } = React.useContext(GlobalContext);

  const wheelValue = new Animated.Value(0);

  //const centerValue = new Animated.Value(0);

  const storeData = async (value) => {
    try {
      const jsonValue = JSON.stringify(value);
      await AsyncStorage.setItem("user", jsonValue);
    } catch (e) {
      // saving error
      console.log(e);
    }
  };

  const setCasilla = (prize) => {
    console.log("prize", prize);
    if (prize === undefined) {
      setCasillaFinal("1778deg");
    } else {
      switch (prize.type) {
        case "Jackpot":
          setCasillaFinal("1643deg"); // 1443 + 180
          break;
        case "TopUpBonus":
          if (prize.amount === 20) {
            setCasillaFinal("1688deg");
          }
          if (prize.amount === 40) {
            setCasillaFinal("1733deg");
          }
      }
    }
  };

  const onPressWheel = () => {
    const current_prize = userState.prize;

    const user_token = userState.token;
    const url = `${BASE_URL}/prize/play/`;

    if (current_prize === null) {
      fetch(url, {
        method: "post",
        headers: new Headers({
          "Authorization": `Bearer ${user_token}`,
          "Content-Type": "application/json"
        })
      })
        .then((response) => {
          console.log("nada por acqui");
          return response.json();
        })
        .then((result) => {
          console.log("result", result);
          const _prize = result.json();
          //console.log(_prize);
          storeData({ ...userState, prize: _prize });
          userDispatch(set_prize(_prize));
          // setPrizeLocal(_prize);

          setCasilla(_prize);
        })

        .catch((err) => {
          console.log("error request", err);
        });
    } else {
      setTimeout(() => {
        ToastAndroid.show("Segundo Premio Ganado", ToastAndroid.SHORT);
      }, 6000);
    }

    wheelValue.setValue(0);
    //centerValue.setValue(0);

    Animated.timing(wheelValue, {
      toValue: 1,
      duration: 6000,
      easing: Easing.inOut(Easing.ease),
      useNativeDriver: true
    }).start();
  };

  const wheel = wheelValue.interpolate({
    // Next, interpolate beginning and end values (in this case 0 and 1)

    inputRange: [0, 0.2, 0.4, 0.6, 0.8, 1],
    outputRange: [
      "0deg",
      "360deg",
      "720deg",
      "1080deg",
      "1440deg",
      casillaFinal //1800 complete
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
                onPress={() => setModalVisible(true)}
              />

              {/*<CustomButtom
								customStyle={customStyleRedButton}
								onPress={() => setModalVisible(true)}
							/>*/}
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
                        transform: [{ rotate: wheel }]
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
              {/*<CustomButtom
								customStyle={customStyleBlackButton}
								onPress={() => {
									navigation.jumpTo("Nueva Recarga", {
										screen: "Nueva Recarga",
									});
								}}
							/>*/}
              <NeuButton
                color="#311338"
                width={width / 3.5}
                height={width / 3.5}
                borderRadius={width / 7}
                style={{ marginTop: "90%" }}
                onPress={() => {
                  navigation.jumpTo("Nueva Recarga", {
                    screen: "Nueva Recarga"
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
