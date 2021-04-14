import React from "react";
import Onboarding from "react-native-onboarding-swiper";
import { Image } from "react-native";

const OnBoardingScreen = ({ navigation }) => (
  <Onboarding
    onDone={() => navigation.navigate("Login")}
    onSkip={() => navigation.navigate("Login")}
    pages={[
      {
        backgroundColor: "#fff",
        image: (
          <Image
            source={require("../assets/images/onboarding_test/circle.png")}
          />
        ),
        title: "Onboarding",
        subtitle: "Done with React Native Onboarding Swiper",
      },
      {
        backgroundColor: "#fe6e58",
        image: (
          <Image
            source={require("../assets/images/onboarding_test/square.png")}
          />
        ),
        title: "The Title",
        subtitle: "This is the subtitle that sumplements the title.",
      },
      {
        backgroundColor: "#999",
        image: (
          <Image
            source={require("../assets/images/onboarding_test/triangle.png")}
          />
        ),
        title: "Triangle",
        subtitle: "Beautiful, isn't it?",
      },
    ]}
  />
);

export default OnBoardingScreen;
