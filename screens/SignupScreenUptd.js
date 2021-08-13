import { Ionicons } from "@expo/vector-icons";
import axios from "axios";
import React, { useContext, useState } from "react";
import { ActivityIndicator } from "react-native";
import { KeyboardAvoidingView } from "react-native";
import Toast from "react-native-root-toast";
import { StyleSheet, Text, View, Dimensions, Image } from "react-native";
import { NeuButton, NeuInput } from "react-native-neu-element";
import { BASE_URL } from "../constants/domain";
import { signup } from "../context/Actions/actions";
import { GlobalContext } from "../context/GlobalProvider";
import * as SecureStore from "expo-secure-store";
import AsyncStorage from "@react-native-async-storage/async-storage";

const { width, height } = Dimensions.get("screen");

const SignupScreenUptd = ({ navigation }) => {
  const { userDispatch } = useContext(GlobalContext);

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
    const phoneRegexp =
      /\(?\+[0-9]{1,3}\)? ?-?[0-9]{1,3} ?-?[0-9]{3,5} ?-?[0-9]{4}( ?-?[0-9]{3})?/;
    return phoneRegexp.test(phone);
  };

  const fetchRegister = async (name, email, phone) => {
    let data = {
      "name": name,
      "email": email,
      "phone": phone
    };

    let requestOptions = {
      method: "post",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data)
    };

    const url = `${BASE_URL}/auth/register`;

    fetch(url, requestOptions)
      .then((response) => {
        if (response.ok) {
          return response.json();
        } else {
          throw Error(`Request rejected with status ${response.status}`);
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
            prize: null
          });

          userDispatch(
            signup({
              token: newUser.accessToken,
              id: newUser.id,
              name: newUser.name,
              email: newUser.email,
              phone: newUser.phone,
              prize: null
            })
          );
        }

        setLoading(false);
      })
      .catch((error) => {
        console.log("error", error);
        Toast.show(error.message, {
          duaration: Toast.durations.LONG,
          position: Toast.positions.BOTTOM,
          shadow: true,
          animation: true,
          hideOnPress: true,
          delay: 0
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
      console.log(error);
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

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior="height"
      enabled={false}
    >
      <View
        style={{
          paddingTop: 50,
          width: width,
          height: height / 6,
          backgroundColor: "rgba(112, 28, 87, 1)",
          flexDirection: "row",
          justifyContent: "space-between"
        }}
      >
        <Image
          source={require("../assets/images/logo.png")}
          resizeMode="center"
        />
      </View>
      <View style={{ alignItems: "center", marginTop: 30 }}>
        <Ionicons name="person-sharp" size={130} color="#ddd" />
      </View>

      <View
        style={{
          flex: 2,
          alignItems: "center",
          marginTop: 30
        }}
      >
        <View style={{ marginTop: 30 }}>
          <View style={{ marginBottom: 5 }}>
            <NeuInput
              textStyle={{
                color: "#fff",
                fontWeight: "bold",
                fontFamily: "monospace"
              }}
              placeholder="Name"
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
            <Text
              style={{
                color: "#ddd",
                fontSize: 16,
                fontFamily: "monospace"
              }}
            >
              {nameError}
            </Text>
          ) : null}
        </View>
        <View style={{ marginTop: 30 }}>
          <View style={{ marginBottom: 5 }}>
            <NeuInput
              textStyle={{
                color: "#fff",
                fontWeight: "bold",
                fontFamily: "monospace"
              }}
              placeholder="Email"
              width={(4 / 5) * width}
              height={40}
              borderRadius={20}
              onChangeText={(value) => onChangeEmail(value)}
              value={email}
              placeholderTextColor="gray"
              color="#701c57"
            />
          </View>

          {emailError !== "" ? (
            <Text
              style={{
                color: "#ddd",
                fontSize: 16,
                fontFamily: "monospace"
              }}
            >
              {emailError}
            </Text>
          ) : null}
        </View>
        <View style={{ marginTop: 30 }}>
          <View style={{ marginBottom: 5 }}>
            <NeuInput
              textStyle={{
                color: "#fff",
                fontWeight: "bold",
                fontFamily: "monospace"
              }}
              placeholder="Phone"
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
            <Text
              style={{
                color: "#ddd",
                fontSize: 16,
                fontFamily: "monospace"
              }}
            >
              {phoneError}
            </Text>
          ) : null}
        </View>
      </View>
      <View style={{ zIndex: 0, flex: 1, alignItems: "center" }}>
        <NeuButton
          color="#701c57"
          width={(4 / 5) * width}
          height={width / 7.5}
          borderRadius={width / 7.5}
          onPress={() => onSubmit()}
          style={{}}
        >
          {loading ? (
            <ActivityIndicator size="large" color="#01f9d2" />
          ) : (
            <Text
              style={{
                color: "#01f9d2",
                fontWeight: "bold",
                fontSize: 20,
                textTransform: "uppercase"
              }}
            >
              Submit
            </Text>
          )}
        </NeuButton>
      </View>
    </KeyboardAvoidingView>
  );
};

export default SignupScreenUptd;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "rgba(112, 28, 87, 1)"
  },
  title: {
    fontSize: 40,
    //flex: 0.5,
    fontWeight: "bold",
    marginBottom: 20,
    marginTop: 50
  },
  input: {
    width: "85%",
    //height: 50,
    // backgroundColor: "rgba(112, 28, 87, 0.1)",
    // borderRadius: 10,
    borderBottomWidth: 2,
    borderBottomColor: "rgba(112, 28, 87, 1)",
    marginVertical: 15,
    paddingLeft: 10
  },
  submitButton: {
    width: "90%",
    height: 50,
    marginTop: 30
  }
});
