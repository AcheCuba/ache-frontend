import React, { useContext, useState, useEffect } from "react";
import { ActivityIndicator, TextInput, TouchableOpacity } from "react-native";
import Toast from "react-native-root-toast";
import { View, Dimensions } from "react-native";
//import { NeuButton, NeuInput } from "react-native-neu-element";
import { BASE_URL } from "../constants/domain";
import { signup } from "../context/Actions/actions";
import { GlobalContext } from "../context/GlobalProvider";
// import * as SecureStore from "expo-secure-store";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { ImageBackground } from "react-native";
import { TextBold } from "../components/CommonText";
import axios from "axios";
import { buttonColor } from "../constants/commonColors";
import { TouchableWithoutFeedback } from "react-native";
import { Keyboard } from "react-native";
// import { getPrizeForUser } from "../libs/getPrizeForUser";

const { width, height } = Dimensions.get("screen");
//console.log(height / 7);

const TfaScreen = ({ route }) => {
  const { userState, userDispatch } = useContext(GlobalContext);
  const { name, email, phone } = route.params;

  const [loadingTwo, setLoadingTwo] = useState(false);
  const [codeIn, setCodeIn] = useState("");
  const [resendOption, setResendOption] = useState(false);

  const { idioma } = userState;

  /*  useEffect(
    () =>
      navigation.addListener("beforeRemove", (e) => {
        e.preventDefault();
      }),
    [navigation]
  ); */

  /* async function storeSacureValue(key, value) {
    await SecureStore.setItemAsync(key, value);
  } */

  const storeData = async (value) => {
    try {
      const jsonValue = JSON.stringify(value);
      await AsyncStorage.setItem("user", jsonValue);
    } catch (e) {
      // saving error
      // console.log(error);
    }
  };

  const onChangeCode = (codeValue) => {
    //setCode(codeValueIn);
    if (codeValue.length <= 6) {
      setCodeIn(codeValue);
    }
  };

  const onPressResend = (phoneNumber) => {
    //const user_token = userState.token;

    const url = `${BASE_URL}/auth/send-verification-code`;

    let config = {
      method: "post",
      url,
      params: { phoneNumber },
    };
    axios(config)
      .then((response) => {
        if (response.status === 200 || response.status == 201) {
          // code sent
          console.log("code sent");
          setLoadingTwo(false);
          setCodeIn("");
          setResendOption(false);
        }
      })
      .catch((error) => {
        if (error.response) {
          // The request was made and the server responded with a status code
          // that falls out of the range of 2xx
          setLoadingTwo(false);

          Toast.show(error.response.data.message, {
            duaration: Toast.durations.LONG,
            position: Toast.positions.BOTTOM,
            shadow: true,
            animation: true,
            hideOnPress: true,
            delay: 0,
          });
        }
      });
  };

  const checkVerificationCode = () => {
    const url = `${BASE_URL}/auth/check-verification-code`;

    //console.log(codeIn);

    let config = {
      method: "get",
      url: url,
      params: {
        phoneNumber: phone,
        code: codeIn,
      },
      /* headers: {
        Authorization: `Bearer ${user_token}`,
      }, */
    };
    return axios(config);
  };

  const fetchRegister = async (name, email, phone) => {
    let data = {
      name: name,
      email: email.trim(),
      phone: phone.replace(/-/g, "").replace(/ /g, ""),
      lang: idioma,
    };
    /* let data = {
      name: "elias",
      email: "elias@sab.com",
      phone: "+34695082384",
      lang: "esp",
    }; */

    //console.log(data);

    let requestOptions = {
      method: "post",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    };

    const url = `${BASE_URL}/auth/register`;

    fetch(url, requestOptions)
      .then((response) => {
        console.log(response.ok);
        if (response.ok) {
          return response.json();
        } else {
          throw Error(`Request rejected with status ${response.status}`);
          //throw Error("No se pudo registrar a este usuario");
        }
      })
      .then((result) => {
        //console.log(result);
        //console.log(typeof result);

        const newUser = result;

        if (newUser) {
          setLoadingTwo(false);

          // const token = newUser.accessToken;
          // storeSacureValue("token", token);
          storeData({
            token: newUser.accessToken, //new
            id: newUser.id,
            name: newUser.name,
            email: newUser.email,
            phone: newUser.phone,
            prize: null,
            idioma: idioma, //new
            country: "CUB",
          });

          userDispatch(
            signup({
              token: newUser.accessToken,
              id: newUser.id,
              name: newUser.name,
              email: newUser.email,
              phone: newUser.phone,
              prize: null,
              idioma: idioma,
              country: "CUB",
            })
          );

          // se llama a useCachedResources() para
          // actualizar la data de premios
          // de este user
        }

        setLoadingTwo(false);
      })
      .catch((error) => {
        //console.log("error", error);
        Toast.show(error.message, {
          duaration: Toast.durations.LONG,
          position: Toast.positions.BOTTOM,
          shadow: true,
          animation: true,
          hideOnPress: true,
          delay: 0,
        });
        setLoadingTwo(false);
      });
  };

  const onPressVerify = () => {
    if (codeIn.length !== 6) {
      //fetchRegister(name, email, phone);

      Toast.show(
        idioma === "spa"
          ? "Introduzca un código de 6 dígitos"
          : "Enter a 6-digit code",
        {
          duaration: Toast.durations.LONG,
          position: Toast.positions.BOTTOM,
          shadow: true,
          animation: true,
          hideOnPress: true,
          delay: 0,
        }
      );
      setLoadingTwo(false);
    } else {
      setLoadingTwo(true);

      // == quitar con api actualizada
      // fetchRegister(name, email, phone);
      // == quitar con api actualizada

      checkVerificationCode()
        .then((response) => {
          if (response.status === 200) {
            //console.log(response.status);
            // valid code => signup
            fetchRegister(name, email, phone);
            //setLoadingTwo(false);
          }
        })
        .catch((error) => {
          if (error.response) {
            // The request was made and the server responded with a status code
            // that falls out of the range of 2xx

            if (error.response.status === 500) {
              setResendOption(true);
            }

            setLoadingTwo(false);

            //console.log(error.response.data);
            //console.log(error.response.status);
            //console.log(error.response.headers);
            Toast.show(error.response.data.message, {
              duaration: Toast.durations.LONG,
              position: Toast.positions.BOTTOM,
              shadow: true,
              animation: true,
              hideOnPress: true,
              delay: 0,
            });
          }
        });
    }
  };

  /*  useEffect(() => {
    console.log(name, email, phone);
  }); */

  return (
    <ImageBackground
      source={require("../assets/images/degradado_general.png")}
      style={{
        width: "100%",
        height: "100%",
        flex: 1,
        justifyContent: "center",
      }}
      transition={false}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View
          style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
        >
          <View
            style={{
              marginBottom: 30,
            }}
          >
            <TextInput
              style={{
                backgroundColor: buttonColor,
                fontWeight: "bold",
                fontFamily: "bs-italic",
                fontSize: 26,
                padding: 10,
                textAlign: "center",
              }}
              placeholder={idioma === "spa" ? "CÓDIGO" : "CODE"}
              width={300}
              height={60}
              borderRadius={30}
              onChangeText={(value) => onChangeCode(value)}
              value={codeIn}
              placeholderTextColor="gray"
              color={"#fff"}
              keyboardType="numeric"
            />
          </View>

          <View
            style={{
              zIndex: 0,
              //flex: 1,
              //alignItems: "center",
              //marginTop: normalize(-40),
              //marginTop: -120,
            }}
          >
            {resendOption ? (
              <TouchableOpacity
                activeOpacity={0.6}
                onPress={() => onPressResend(phone)}
                disabled={loadingTwo}
                style={{
                  backgroundColor: buttonColor,
                  borderRadius: width / 7.5,
                  width: 180,
                  height: 50,
                  justifyContent: "center",
                  alignItems: "center",
                  marginTop: 5,
                }}
              >
                {loadingTwo ? (
                  <ActivityIndicator size="large" color="#01f9d2" />
                ) : (
                  <TextBold
                    text={idioma === "spa" ? "REENVIAR" : "RESEND"}
                    style={{
                      color: "#fff800",
                      //fontWeight: "bold",
                      fontSize: 20,
                      textTransform: "uppercase",
                    }}
                  />
                )}
              </TouchableOpacity>
            ) : (
              <TouchableOpacity
                activeOpacity={0.6}
                onPress={() => onPressVerify()}
                disabled={loadingTwo}
                style={{
                  backgroundColor: buttonColor,
                  borderRadius: width / 7.5,
                  width: 180,
                  height: 50,
                  justifyContent: "center",
                  alignItems: "center",
                  marginTop: 5,
                }}
              >
                {loadingTwo ? (
                  <ActivityIndicator size="large" color="#01f9d2" />
                ) : (
                  <TextBold
                    text={idioma === "spa" ? "VERIFICAR" : "VERIFY"}
                    style={{
                      color: "#fff800",
                      //fontWeight: "bold",
                      fontSize: 20,
                      textTransform: "uppercase",
                    }}
                  />
                )}
              </TouchableOpacity>
            )}
          </View>
        </View>
      </TouchableWithoutFeedback>
    </ImageBackground>
  );
};

export default TfaScreen;
