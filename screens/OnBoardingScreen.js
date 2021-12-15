import React from "react";
import Onboarding from "react-native-onboarding-swiper";
import { Image, Dimensions } from "react-native";
import { View } from "react-native";
import { ImageBackground } from "react-native";

const { width, height } = Dimensions.get("screen");

const OnBoardingScreen = ({ navigation }) => (
  <Onboarding
    onDone={() => navigation.navigate("Signup")}
    onSkip={() => navigation.navigate("Signup")}
    pages={[
      {
        backgroundColor: "#701c57",
        image: (
          <ImageBackground
            source={require("../assets/images/onboarding/onboarding_01.jpg")}
            style={{ width: width, height: height }}
          />
        ),
        title: "Onboarding",
        subtitle: "Done with React Native Onboarding Swiper",
      },
      {
        backgroundColor: "#701c57",
        image: (
          <View
            style={{
              flex: 1,
              justifyContent: "center",
              alignItems: "center",
              //marginTop: 50,
            }}
          >
            <ImageBackground
              source={require("../assets/images/onboarding/onboarding_02.jpg")}
              style={{ width: width, height: height }}
              //resizeMode="center"
            />
          </View>
        ),
        title: "",
        subtitle: "",
      },
      {
        backgroundColor: "#701c57",
        image: (
          <View
            style={{
              flex: 1,
              justifyContent: "center",
              alignItems: "center",
              marginTop: 100,
            }}
          >
            <ImageBackground
              source={require("../assets/images/onboarding/onboarding_03.jpg")}
              style={{ width: width, height: height }}
              //resizeMode="cover"
            />
          </View>
        ),
        title: "",
        subtitle: "",
      },
      {
        backgroundColor: "#701c57",
        image: (
          <ImageBackground
            source={require("../assets/images/onboarding/onboarding_04.jpg")}
            style={{ width: width, height: height }}
          />
        ),
        title: "",
        subtitle: "",
      },
    ]}
  />
);

export default OnBoardingScreen;
