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
                  text="Bienvenida/o"
                  style={{
                    marginTop: 60,
                    fontSize: 40,
                    color: "#fffb00",
                    textTransform: "uppercase",
                  }}
                />
                <TextMedium
                  text="¡Ya tienes ACHÉ! En breve podrás recargar y probar suerte jugando. Solo debes seguir los pasos. Gracias por ser miembro de nuestra comunidad."
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
              <View
                style={{ position: "absolute", top: 80, paddingHorizontal: 10 }}
              >
                <View
                  style={{ flexDirection: "row", justifyContent: "center" }}
                >
                  <TextMedium
                    text="¡Esta es nuestra "
                    style={{
                      //marginTop: 100,
                      fontSize: 20,
                      textAlign: "center",
                      color: "#fffc00",
                    }}
                  />
                  <TextBold
                    text="Ruleta de la Fortuna!"
                    style={{
                      fontSize: 20,
                      textAlign: "center",
                      color: "#fffc00",
                    }}
                  />
                </View>

                <TextMedium
                  text="Gana bonos, regálalos o agrégalos a tus recargas. Con buen ACHÉ te caerá"
                  style={{
                    //marginTop: 100,
                    fontSize: 20,
                    textAlign: "center",
                    color: "#fffc00",
                  }}
                />
                <TextMedium
                  text="¡el súper premio!"
                  style={{
                    //marginTop: 100,
                    fontSize: 20,
                    textAlign: "center",
                    color: "#fffc00",
                  }}
                />
              </View>

              <View style={{ position: "absolute", left: 0, top: height / 6 }}>
                <Image
                  source={require("../assets/animaciones/media_ruleta_.gif")}
                  style={{ width: height / 2.4, height: height / 1.5 }}
                />
              </View>
              <View
                style={{
                  marginTop: 100,
                  position: "absolute",
                  bottom: 80,
                  paddingHorizontal: 10,
                }}
              >
                <TextMedium
                  text="Gira la Ruleta y gana. Juega y comparte."
                  style={{
                    fontSize: 20,
                    textAlign: "center",
                    color: "#fffc00",
                  }}
                />
                <TextMedium
                  text="Con ACHÉ, tus recargas serán divertidas."
                  style={{
                    fontSize: 20,
                    textAlign: "center",
                    color: "#fffc00",
                  }}
                />
              </View>
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
                  source={require("../assets/animaciones/media_ruleta_.gif")}
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
                    {/* <Image
                      source={require("../assets/animaciones/TROFEO.gif")}
                      //resizeMode="center"
                      style={{
                        width: 95, //width / 3,
                        height: 115, //width / 3,
                      }}
                    /> */}
                    {/*  <Image
                      source={require("../assets/images/home/trofeo_lleno.png")}
                      //resizeMode="center"
                      style={{
                        width: 60,
                        height: 92,
                      }}
                    /> */}
                    <Image
                      source={require("../assets/animaciones/trofeo_lleno.gif")}
                      //resizeMode="center"
                      style={{
                        width: 80, //width: 60,
                        height: 115, //height: 92,
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
                  <View style={{ paddingHorizontal: 25 }}>
                    <View
                      style={{ flexDirection: "row", justifyContent: "center" }}
                    >
                      <TextMedium
                        text="El "
                        style={{
                          fontSize: 20,
                          color: "#fffc00",
                        }}
                      />
                      <TextBold
                        text="Trofeo"
                        style={{
                          fontSize: 20,
                          color: "#fffc00",
                        }}
                      />
                      <TextMedium
                        text=" guarda tu ACHÉ."
                        style={{
                          fontSize: 20,
                          color: "#fffc00",
                        }}
                      />
                    </View>
                    <TextMedium
                      text="Cada premio que ganes lo encontrarás aquí. También podrás regalarlo como un código o añadirlo a una recarga directamente."
                      style={{
                        fontSize: 20,
                        color: "#fffc00",
                        textAlign: "center",
                      }}
                    />
                  </View>
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
                  source={require("../assets/animaciones/media_ruleta_.gif")}
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
                  {/*   <Image
                    source={require("../assets/animaciones/TROFEO.gif")}
                    //resizeMode="center"
                    style={{
                      width: 95, //width / 3,
                      height: 115, //width / 3,
                    }}
                  /> */}
                  <Image
                    source={require("../assets/images/home/trofeo_lleno.png")}
                    //resizeMode="center"
                    style={{
                      width: 60,
                      height: 92,
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
                    {/* <Image
                      //source={require("../assets/animaciones/moneda-recarga-rapida.gif")}
                      source={require("../assets/images/home/recarga_directa.png")}
                      //resizeMode="center"
                      style={{
                        width: 65,
                        height: 67,

                        //width: 95,
                        //height: 115,
                      }}
                    /> */}
                    <Image
                      source={require("../assets/animaciones/moneda-recarga-rapida.gif")}
                      style={{
                        width: 90,
                        height: 110,
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
                  <View style={{ paddingHorizontal: 25 }}>
                    <View
                      style={{ flexDirection: "row", justifyContent: "center" }}
                    >
                      <TextMedium
                        text="La "
                        style={{
                          fontSize: 20,
                          color: "#fffc00",
                        }}
                      />
                      <TextBold
                        text="Moneda"
                        style={{
                          fontSize: 20,
                          color: "#fffc00",
                        }}
                      />
                      <TextMedium
                        text=" será tu ACHÉ rápido."
                        style={{
                          fontSize: 20,
                          color: "#fffc00",
                        }}
                      />
                    </View>
                    <TextMedium
                      text="Si tienes poco tiempo, aquí encontrarás la recarga instantánea. Podrás incluir varios contactos y decidir a quién envías el premio."
                      style={{
                        fontSize: 20,
                        color: "#fffc00",
                        textAlign: "center",
                      }}
                    />
                  </View>
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
