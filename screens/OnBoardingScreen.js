import React from "react";
import Onboarding from "react-native-onboarding-swiper";
import { Image, Dimensions, Animated } from "react-native";
import { View } from "react-native";
import { ImageBackground } from "react-native";
import { TextBold, TextMedium } from "../components/CommonText";
import { NeuButton } from "react-native-neu-element";
import { Modal } from "react-native";
import { LinearGradient } from "expo-linear-gradient";

const { width, height } = Dimensions.get("screen");

const OnBoardingScreen = ({ navigation }) => {
  const [pageIndex, setPageIndex] = React.useState(0);
  const [showSkip, setShowSkip] = React.useState(false);

  const getPageIndex = (newIndex) => {
    setTimeout(() => {
      setPageIndex(newIndex);
    }, 1);
  };

  React.useEffect(() => {
    //console.log(pageIndex);
    if (pageIndex === 0) {
      setShowSkip(true);
    } else {
      setShowSkip(false);
    }
  }, [pageIndex]);

  return (
    <Onboarding
      onDone={() => navigation.navigate("Signup")}
      onSkip={() => navigation.navigate("Signup")}
      showNext={false}
      showSkip={showSkip}
      imageContainerStyles={{ paddingBottom: 0 }}
      containerStyles={{}}
      pageIndexCallback={getPageIndex}
      bottomBarHighlight={true}
      bottomBarHeight={50}
      pages={[
        {
          backgroundColor: "rgb(45,22,56)",
          image: (
            <View style={{}}>
              <ImageBackground
                source={require("../assets/images/degradado_home.png")}
                style={{
                  width: width,
                  height: height,
                  alignItems: "center",
                  //marginTop: 100,
                  zIndex: 10,
                }}
              >
                <Image
                  source={require("../assets/images/Logo_amarillo.png")}
                  style={{ width: 120, height: 60, marginTop: 100 }}
                />

                <Image
                  source={require("../assets/images/emojis/emoji_wink.png")}
                  style={{ width: 150, height: 150, marginTop: 60 }}
                />

                <TextBold
                  text="Welcome"
                  style={{
                    marginTop: 60,
                    fontSize: 40,
                    color: "#fffb00",
                    textTransform: "uppercase",
                  }}
                />
                <TextMedium
                  text="Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
              eiusmod tempor incididunt ut labore et dolore magna aliqua"
                  style={{
                    marginTop: 20,
                    fontSize: 20,
                    textAlign: "center",
                    color: "#fffb00",
                    marginHorizontal: 80,

                    //textTransform: "uppercase",
                  }}
                />
              </ImageBackground>
            </View>
          ),
          title: "",
          subtitle: "",
        },
        {
          backgroundColor: "rgb(45,22,56)",
          image: (
            <ImageBackground
              source={require("../assets/images/degradado_home.png")}
              style={{
                width: width,
                height: height,
                alignItems: "center",
              }}
            >
              <TextMedium
                text="Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
              eiusmod tempor incididunt ut labore"
                style={{
                  //marginTop: 100,
                  fontSize: 20,
                  textAlign: "center",
                  color: "#fffc00",
                  position: "absolute",
                  top: 80,
                }}
              />
              <View style={{ position: "absolute", left: 0, top: height / 6 }}>
                <Image
                  source={require("../assets/animaciones/media_ruleta.gif")}
                  style={{ width: height / 2.4, height: height / 1.5 }}
                />
              </View>
              <TextMedium
                text="Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
              eiusmod tempor incididunt ut labore"
                style={{
                  marginTop: 100,
                  fontSize: 20,
                  textAlign: "center",
                  color: "#fffc00",
                  position: "absolute",
                  bottom: 80,
                }}
              />
            </ImageBackground>
          ),
          title: "",
          subtitle: "",
        },

        {
          backgroundColor: "rgb(45,22,56)",
          image: (
            <ImageBackground
              source={require("../assets/images/degradado_home.png")}
              style={{
                width: width,
                height: height,
                alignItems: "center",
              }}
            >
              <View style={{ position: "absolute", left: 0, top: height / 6 }}>
                <Image
                  source={require("../assets/animaciones/media_ruleta.gif")}
                  style={{ width: height / 2.4, height: height / 1.5 }}
                />
              </View>

              <LinearGradient
                colors={["rgba(227, 123, 104,0.7)", "rgba(45,22,56,1)"]}
                style={{ flex: 1, width: width }}
              >
                <View
                  style={{
                    flexDirection: "row",
                    justifyContent: "flex-end",
                    //width: "85%",
                    position: "absolute",
                    top: 100,
                    right: 30,
                  }}
                >
                  <NeuButton
                    color="#fe8457"
                    width={width / 3.5}
                    height={width / 3.5}
                    borderRadius={width / 7}
                    active={false}
                    onPress={() => {}}
                  >
                    <Image
                      source={require("../assets/animaciones/TROFEO.gif")}
                      //resizeMode="center"
                      style={{
                        width: 95, //width / 3,
                        height: 115, //width / 3,
                      }}
                    />
                  </NeuButton>
                </View>
                <View
                  style={{
                    flex: 1,
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <TextMedium
                    text="Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
                    eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut
                    enim ad minim veniam"
                    style={{
                      //marginTop: 100,
                      fontSize: 20,
                      textAlign: "center",
                      color: "#fffc00",
                      paddingHorizontal: 40,
                      //position: "absolute",
                      //bottom: 80,
                    }}
                  />
                </View>
              </LinearGradient>
            </ImageBackground>
          ),
          title: "",
          subtitle: "",
        },
        {
          backgroundColor: "rgb(45,22,56)",
          image: (
            <ImageBackground
              source={require("../assets/images/degradado_home.png")}
              style={{
                width: width,
                height: height,
                alignItems: "center",
              }}
            >
              <View style={{ position: "absolute", left: 0, top: height / 6 }}>
                <Image
                  source={require("../assets/animaciones/media_ruleta.gif")}
                  style={{ width: height / 2.4, height: height / 1.5 }}
                />
              </View>
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "flex-end",
                  //width: "85%",
                  position: "absolute",
                  top: 100,
                  right: 30,
                }}
              >
                <NeuButton
                  color="#fe8457"
                  width={width / 3.5}
                  height={width / 3.5}
                  borderRadius={width / 7}
                  active={false}
                  onPress={() => {}}
                >
                  <Image
                    source={require("../assets/animaciones/TROFEO.gif")}
                    //resizeMode="center"
                    style={{
                      width: 95, //width / 3,
                      height: 115, //width / 3,
                    }}
                  />
                </NeuButton>
              </View>

              <LinearGradient
                colors={["rgba(227, 123, 104,1)", "rgba(45,22,56,0.7)"]}
                style={{ flex: 1, width: width }}
              >
                <View
                  style={{
                    flexDirection: "row",
                    justifyContent: "flex-end",
                    //width: "85%",
                    position: "absolute",
                    bottom: 100,
                    right: 30,
                  }}
                >
                  <NeuButton
                    color="#311338"
                    width={width / 3.5}
                    height={width / 3.5}
                    borderRadius={width / 7}
                    active={false}
                    onPress={() => {}}
                  >
                    <Image
                      source={require("../assets/animaciones/moneda-recarga-rapida.gif")}
                      //resizeMode="center"
                      style={{
                        width: 95, //width / 3,
                        height: 115, //width / 3,
                      }}
                    />
                  </NeuButton>
                </View>
                <View
                  style={{
                    flex: 1,
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <TextMedium
                    text="Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
                  eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut
                  enim ad minim veniam"
                    style={{
                      //marginTop: 100,
                      fontSize: 20,
                      textAlign: "center",
                      color: "#fffc00",
                      paddingHorizontal: 40,
                      //position: "absolute",
                      //bottom: 80,
                    }}
                  />
                </View>
              </LinearGradient>
            </ImageBackground>
          ),
          title: "",
          subtitle: "",
        },
      ]}
    />
  );
};

export default OnBoardingScreen;
