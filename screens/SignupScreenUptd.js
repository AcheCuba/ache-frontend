import React, { useContext, useState } from "react";
import { ActivityIndicator, TouchableWithoutFeedback } from "react-native";
import Toast from "react-native-root-toast";
import { StyleSheet, View, Dimensions, Image, Platform } from "react-native";
//import { NeuButton, NeuInput } from "react-native-neu-element";
import NeuButton from "../libs/neu_element/NeuButton";
import NeuInput from "../libs/neu_element/NeuInput" 

import { BASE_URL } from "../constants/domain";
import { signup } from "../context/Actions/actions";
import { GlobalContext } from "../context/GlobalProvider";
import * as SecureStore from "expo-secure-store";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { Keyboard } from "react-native";
import { ImageBackground } from "react-native";
import { TextBold, TextItalic, TextMedium } from "../components/CommonText";
import normalize from "react-native-normalize";

const { width, height } = Dimensions.get("screen");
//console.log(height / 7);

const SignupScreenUptd = ({ navigation }) => {
  const { userState, userDispatch } = useContext(GlobalContext);

  const { idioma } = userState;

  const [loading, setLoading] = React.useState(false);
  const [name, setName] = React.useState("");
  const [email, setEmail] = React.useState("");
  const [phone, setPhone] = React.useState("");

  const [phoneError, setPhoneError] = React.useState("");
  const [emailError, setEmailError] = React.useState("");
  const [nameError, setNameError] = React.useState("");

  React.useEffect(
    () =>
      navigation.addListener("beforeRemove", (e) => {
        e.preventDefault();
      }),
    [navigation]
  );

  //React.useEffect(() => console.log(loading));

  const onChangeName = (nameValue) => {
    // required
    setNameError("");
    setName(nameValue);
  };

  const onChangeEmail = (emailValue) => {
    setEmailError("");
    setEmail(emailValue);
  };

  const onChangePhone = (phoneValue) => {
    setPhoneError("");
    setPhone(phoneValue);
  };

  const checkEmail = () => {
    const emailRegexp =
      /^(([^<>()\[\]\\.,;:\s@”]+(\.[^<>()\[\]\\.,;:\s@”]+)*)|(“.+”))@((\[[0–9]{1,3}\.[0–9]{1,3}\.[0–9]{1,3}\.[0–9]{1,3}])|(([a-zA-Z\-0–9]+\.)+[a-zA-Z]{2,}))$/;

    return emailRegexp.test(email);
  };

  const checkPhone = () => {
    const cleanPhone = phone.replace(/-/g, "").replace(/ /g, "");
    //console.log(cleanPhone);
    const phoneRegexp =
      /\(?\+[0-9]{1,3}\)? ?-?[0-9]{1,3} ?-?[0-9]{3,5} ?-?[0-9]{4}( ?-?[0-9]{3})?/;
    return phoneRegexp.test(cleanPhone);
  };

  const fetchRegister = async (name, email, phone) => {
    let data = {
      name: name,
      email: email.trim(),
      phone: phone.replace(/-/g, "").replace(/ /g, ""),
      lang: idioma,
    };

    //console.log(data);

    let requestOptions = {
      method: "post",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    };

    const url = `${BASE_URL}/auth/register`;

    fetch(url, requestOptions)
      .then((response) => {
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
          const token = newUser.accessToken;
          storeSacureValue("token", token);
          storeData({
            //token: newUser.accessToken,
            id: newUser.id,
            name: newUser.name,
            email: newUser.email,
            phone: newUser.phone,
            prize: null,
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
            })
          );
        }

        setLoading(false);
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
        setLoading(false);
      });
  };

  async function storeSacureValue(key, value) {
    await SecureStore.setItemAsync(key, value);
  }

  const storeData = async (value) => {
    try {
      const jsonValue = JSON.stringify(value);
      await AsyncStorage.setItem("user", jsonValue);
    } catch (e) {
      // saving error
      // console.log(error);
    }
  };

  const onSubmit = async () => {
    // set data
    // console.log(data);

    const validEmail = checkEmail();
    const validPhone = checkPhone();

    if (name === "") {
      setNameError("Name required");
    } else {
      if (!validEmail) {
        setEmailError("Invalid Email");
      } else {
        if (!validPhone) {
          setPhoneError("Invalid Phone");
        } else {
          // todo ok
          setLoading(true);
          await fetchRegister(name, email, phone);
        }
      }
    }
  };

  //const ScrollViewRef = useRef();

  /* const _scrollToInput = (reactNode) => {
    // Add a 'scroll' ref to your ScrollView
    
    //this.scroll.props.scrollToFocusedInput(reactNode)
  } */

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
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
        <KeyboardAwareScrollView
          extraHeight={Platform.OS === "ios" ? 10 : 32} //5:24 antes
          extraScrollHeight={Platform.OS === "ios" ? 10 : 32} //5:24 antes
          //behavior={Platform.OS === "ios" ? "padding" : "height"}
          enableOnAndroid
        >
          <View
            style={{
              paddingTop: normalize(50),
              width: width,
              height: height / 6,
              backgroundColor: "rgba(112, 28, 87, 1)",
              flexDirection: "row",
              //justifyContent: "space-between",
              justifyContent: "center",
              //marginBottom: 30,
            }}
          >
            <Image
              source={require("../assets/images/logo.png")}
              //resizeMode="center"
              style={{
                //marginLeft: width / 10,
                width: width / 4.5,
                height: width / 8.6,
              }}
            />
          </View>
          <View style={{ alignItems: "center" }}>
            {/*           <Ionicons name="person-sharp" size={130} color="#ddd" />
             */}
            <Image
              source={require("../assets/images/emojis/emoji_wink.png")}
              style={{
                width: normalize(height / 7, "height"),
                height: normalize(height / 7, "height"),
              }}
            />

            {idioma === "spa" ? (
              <View
                style={{
                  marginTop: normalize(20, "height"),
                  paddingBottom: normalize(10, "height"),
                  paddingHorizontal: normalize(25, "height"),
                }}
              >
                <TextMedium
                  text="¡Casi listo!"
                  style={{
                    fontSize: 20,
                    color: "#fffc00",
                    textAlign: "center",
                  }}
                />
                <TextMedium
                  text="Regístrate para que puedas comenzar a recargar y pruebes tu ACHÉ."
                  style={{
                    fontSize: 20,
                    color: "#fffc00",
                    textAlign: "center",
                  }}
                />
              </View>
            ) : (
              <View
                style={{
                  marginTop: normalize(20, "height"),
                  paddingBottom: normalize(10, "height"),
                  paddingHorizontal: normalize(25, "height"),
                }}
              >
                <TextMedium
                  text="Almost done!"
                  style={{
                    fontSize: normalize(20),
                    color: "#fffc00",
                    textAlign: "center",
                  }}
                />
                <TextMedium
                  text="Sign up to start sending recharges and try your ACHÉ!"
                  style={{
                    fontSize: normalize(20),
                    color: "#fffc00",
                    textAlign: "center",
                  }}
                />
              </View>
            )}
          </View>

          <View
            style={{
              flex: 2,
              alignItems: "center",
              marginTop: height / 40, //30
              paddingBottom: Platform.OS === "android" ? 50 : 0,
            }}
          >
            <View style={{ marginTop: height / 45 }}>
              <View style={{ marginBottom: 0 }}>
                <NeuInput
                  textStyle={{
                    color: "#fff",
                    fontWeight: "bold",
                    fontFamily: "bs-italic",
                    fontSize: 18,
                  }}
                  placeholder={idioma === "spa" ? "Nombre" : "Name"}
                  width={(4 / 5) * width}
                  height={40}
                  borderRadius={20}
                  onChangeText={(value) => onChangeName(value)}
                  value={name}
                  placeholderTextColor="gray"
                  color="#701c57"
                />
              </View>
              {nameError !== "" ? (
                <TextItalic
                  style={{
                    color: "#ddd",
                    fontSize: 16,
                    marginLeft: 12,
                    marginTop: 4,
                  }}
                  text={nameError}
                />
              ) : (
                <View style={{ height: 20 }}></View>
              )}
            </View>
            <View style={{ marginTop: height / 45 }}>
              <View style={{ marginBottom: 0 }}>
                <NeuInput
                  textStyle={{
                    color: "#fff",
                    fontWeight: "bold",
                    fontFamily: "bs-italic",
                    fontSize: 18,
                  }}
                  placeholder="Email"
                  width={(4 / 5) * width}
                  height={40}
                  borderRadius={20}
                  onChangeText={(value) => onChangeEmail(value)}
                  value={email}
                  placeholderTextColor="gray"
                  color="#701c57"
                  keyboardType="email-address"
                  autoCapitalize="none"
                />
              </View>

              {emailError !== "" ? (
                <TextItalic
                  style={{
                    color: "#ddd",
                    fontSize: 16,
                    marginLeft: 12,
                    marginTop: 4,
                  }}
                  text={emailError}
                />
              ) : (
                <View style={{ height: 20 }}></View>
              )}
            </View>
            <View style={{ marginTop: height / 45 }}>
              <View style={{}}>
                <NeuInput
                  textStyle={{
                    color: "#fff",
                    fontWeight: "bold",
                    fontFamily: "bs-italic",
                    fontSize: 18,
                  }}
                  placeholder={
                    idioma === "spa" ? "Ej. +5350000000" : "Ex. +5350000000"
                  }
                  width={(4 / 5) * width}
                  height={40}
                  borderRadius={20}
                  onChangeText={(value) => onChangePhone(value)}
                  value={phone}
                  placeholderTextColor="gray"
                  color="#701c57"
                  keyboardType="phone-pad"
                />
              </View>

              {phoneError !== "" ? (
                <TextItalic
                  style={{
                    color: "#ddd",
                    fontSize: 16,
                    marginLeft: 12,
                    marginTop: 5,
                  }}
                  text={phoneError}
                />
              ) : null}
            </View>
          </View>
        </KeyboardAwareScrollView>
        <View
          style={{
            zIndex: 0,
            flex: 1,
            alignItems: "center",
            marginTop: normalize(-40),
            //marginTop: -120,
          }}
        >
        <NeuButton
            color="#58184d"
            width={(4 / 5) * width}
            height={height / 14}
            borderRadius={width / 7.5}
            onPress={() => onSubmit()}
            style={{}}
            active={loading}
          >
            {loading ? (
              <ActivityIndicator size="large" color="#01f9d2" />
            ) : (
              <TextBold
                text={idioma === "spa" ? "registrarse" : "sign up"}
                style={{
                  color: "#fff800",
                  //fontWeight: "bold",
                  fontSize: 20,
                  textTransform: "uppercase",
                }}
              />
            )}
          </NeuButton> 
        </View>  
      </ImageBackground>
    </TouchableWithoutFeedback>
  );
};

export default SignupScreenUptd;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "rgba(112, 28, 87, 1)",
  },
  title: {
    fontSize: 40,
    //flex: 0.5,
    fontWeight: "bold",
    marginBottom: 20,
    marginTop: 50,
  },
  input: {
    width: "85%",
    //height: 50,
    // backgroundColor: "rgba(112, 28, 87, 0.1)",
    // borderRadius: 10,
    borderBottomWidth: 2,
    borderBottomColor: "rgba(112, 28, 87, 1)",
    marginVertical: 15,
    paddingLeft: 10,
  },
  submitButton: {
    width: "90%",
    height: normalize(50),
    //marginTop: 30,
  },
});
