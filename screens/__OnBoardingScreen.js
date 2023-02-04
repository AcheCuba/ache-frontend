import React from "react";
import Onboarding from "react-native-onboarding-swiper";
import { Image, Dimensions, Platform } from "react-native";
import { View } from "react-native";
import { ImageBackground } from "react-native";
import { TextBold, TextMedium } from "../components/CommonText";
import NeuButton  from "../libs/neu_element/NeuButton"
//import { LinearGradient } from "expo-linear-gradient";
import { Text } from "react-native";
import { GlobalContext } from "../context/GlobalProvider";
import { TouchableOpacity } from "react-native";
import { setIdioma } from "../context/Actions/actions";
import normalize from "react-native-normalize";

const { width, height } = Dimensions.get("screen");

const OnBoardingScreen = ({ navigation }) => {
  const [pageIndex, setPageIndex] = React.useState(0);
  const [showSkip, setShowSkip] = React.useState(false);
  const [selectedIdiom, setSelectedIdiom] = React.useState("eng");

  /*  const colorTextSpanishAnimation = {
    color: colorSpanishValue.current.interpolate({
      inputRange: [0, 1],
      outputRange: ["rgb(99,71,255)", "rgb(255,99,71)"],
    }),
  }; */

  /* const colorTextEnglishAnimation = {
    color: colorEnglishValue.current.interpolate({
      inputRange: [0, 1],
      outputRange: ["rgb(99,71,255)", "rgb(255,99,71)"],
    }),
  }; */

  const { userState, userDispatch } = React.useContext(GlobalContext);
  const { idioma } = userState;

  const getPageIndex = (newIndex) => {
    setTimeout(() => {
      setPageIndex(newIndex);
    }, 1);
  };

  React.useEffect(() => {
    console.log(pageIndex)
    //console.log(pageIndex);
    if (pageIndex === 0) {
      setShowSkip(true);
    } else {
      setShowSkip(false);
    }
  }, [pageIndex]);

  return(
    <Onboarding
    onDone={() => navigation.navigate("Signup")}
    onSkip={() => navigation.navigate("Signup")}
    //showNext={false}
    showSkip={showSkip}
    skipLabel={idioma == "eng" ? "skip" : "omitir"}
    imageContainerStyles={{ paddingBottom: 0 }}
    containerStyles={{}}
    pageIndexCallback={getPageIndex}
    bottomBarHighlight={true}
    bottomBarHeight={50}
    pages={[
      {
        backgroundColor: '#fff',
        title: 'Onboarding',
        image:  (<ImageBackground
        source={require("../assets/images/degradado_home.png")}
        style={{
          width: width,
          height: height,
          alignItems: "center",
          justifyContent: "center",
          //marginTop: 100,
          zIndex: 10,
        }}
        />),
        subtitle: 'Done with React Native Onboarding Swiper',
        title: ""
      },
      {
        backgroundColor: '#fff',
        title: 'Onboarding 1',
        image:  (<ImageBackground
        source={require("../assets/images/degradado_home.png")}
        style={{
          width: width,
          height: height,
          alignItems: "center",
          justifyContent: "center",
          //marginTop: 100,
          zIndex: 10,
        }}
        />),
        subtitle: 'Done with React Native Onboarding Swiper',
        title: ""
      },
      {
        backgroundColor: '#fff',
        title: 'Onboarding 2',
        image:  (<ImageBackground
        source={require("../assets/images/degradado_home.png")}
        style={{
          width: width,
          height: height,
          alignItems: "center",
          justifyContent: "center",
          //marginTop: 100,
          zIndex: 10,
        }}
        />),
        subtitle: 'Done with React Native Onboarding Swiper',
        title: ""
      },
      {
        backgroundColor: '#fff',
        title: 'Onboarding test',
        image: (
            <ImageBackground
              source={require("../assets/images/degradado_home.png")}
              style={{
                width: width,
                height: height,
                alignItems: "center",
              }}
            >
              {idioma === "spa" ? (
                <>
                  <View
                    style={{
                      position: "absolute",
                      //top: 80,
                      top:
                        Platform.OS === "android"
                          ? normalize(110)
                          : normalize(80),
                      paddingHorizontal: 10,
                    }}
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
                        text="Ruleta de las Recargas!"
                        style={{
                          fontSize: 20,
                          textAlign: "center",
                          color: "#fffc00",
                        }}
                      />
                    </View>

                    <TextMedium
                      text="Prueba tu suerte y gana premios."
                      style={{
                        //marginTop: 100,
                        fontSize: 20,
                        textAlign: "center",
                        color: "#fffc00",
                      }}
                    />
                    <TextMedium
                      text="Con buen ACHÉ te caerá"
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

                  <View
                    style={{
                      position: "absolute",
                      left: 0,
                      top: normalize(height / 6, "height"),
                    }}
                  >
                    <Image
                      source={require("../assets/animaciones/media-ruleta-para-onboarding-15mg.gif")}
                      style={{
                        width: height / 2.4,
                        height: height / 1.5,
                      }}
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
                </>
              ) : (
                <>
                  <View
                    style={{
                      position: "absolute",
                      //top: 60,
                      top:
                        Platform.OS === "android"
                          ? normalize(110)
                          : normalize(80),
                      paddingHorizontal: 10,
                    }}
                  >
                    <View
                      style={{ flexDirection: "row", justifyContent: "center" }}
                    >
                      <TextMedium
                        text="Play our "
                        style={{
                          //marginTop: 100,
                          fontSize: 20,
                          textAlign: "center",
                          color: "#fffc00",
                        }}
                      />
                      <TextBold
                        text="Recharge Roulette!"
                        style={{
                          fontSize: 20,
                          textAlign: "center",
                          color: "#fffc00",
                        }}
                      />
                    </View>
                    <View>
                      <TextMedium
                        text="Try your luck and win prizes. With a really good ACHÉ you could get the jackpot!"
                        style={{
                          //marginTop: 100,
                          fontSize: 20,
                          textAlign: "center",
                          color: "#fffc00",
                        }}
                      />
                    </View>
                  </View>

                  <View
                    style={{
                      position: "absolute",
                      left: 0,
                      top: normalize(height / 6, "height"),
                    }}
                  >
                    <Image
                      source={require("../assets/animaciones/media-ruleta-para-onboarding-15mg.gif")}
                      style={{ width: height / 2.4, height: height / 1.5 }}
                    />
                  </View>
                  <View
                    style={{
                      marginTop: 100,
                      position: "absolute",
                      bottom: 60,
                      paddingHorizontal: 10,
                    }}
                  >
                    <TextMedium
                      text="Spin the Wheel and win. Play and share. Your recharges will be way more fun with ACHÉ."
                      style={{
                        //marginTop: 100,
                        fontSize: 20,
                        textAlign: "center",
                        color: "#fffc00",
                      }}
                    />
                  </View>
                </>
              )}
            </ImageBackground>
          ),
          title: "",
          subtitle: "",
        },

          {
                    backgroundColor: '#fff',
                    title: 'Onboarding 5',
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
                              source={require("../assets/animaciones/media-ruleta-para-onboarding-15mg.gif")}
                              style={{ width: height / 2.4, height: height / 1.5 }}
                            />
                          </View>
                          
                    
                        
                            {idioma === "spa" ? (
                              <View
                                style={{
                                  flex: 1,
                                  justifyContent: "center",
                                  alignItems: "center",
                                }}
                              >
                                <View style={{ paddingHorizontal: 25 }}>
                                  <View
                                    style={{
                                      flexDirection: "row",
                                      justifyContent: "center",
                                    }}
                                  >
                                    <TextBold
                                      text="El Rayo."
                                      style={{
                                        fontSize: 20,
                                        color: "#fffc00",
                                        textTransform: "uppercase",
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
                            ) : (
                              <View
                                style={{
                                  flex: 1,
                                  justifyContent: "center",
                                  alignItems: "center",
                                }}
                              >
                                <View style={{ paddingHorizontal: 25 }}>
                                  <View
                                    style={{
                                      flexDirection: "row",
                                      justifyContent: "center",
                                    }}
                                  >
                                    <TextBold
                                      text="The Lighting or The Flash"
                                      style={{
                                        fontSize: 20,
                                        color: "#fffc00",
                                        textTransform: "uppercase",
                                      }}
                                    />
                                  </View>
                                  <TextMedium
                                    text="If you’re in a rush here you’ll find the instant recharge. You could include several contacts and even decide who you’re going to send your prize to."
                                    style={{
                                      fontSize: 20,
                                      color: "#fffc00",
                                      textAlign: "center",
                                    }}
                                  />
                                </View>
                              </View>
                            )}
                    
                        </ImageBackground>
                      ),
                    subtitle: 'Done with React Native Onboarding Swiper',
                    title: ""
                  }
    ]}
  />
    
  )
}

export default OnBoardingScreen;
/*
 <LinearGradient
                    colors={["rgba(227, 123, 104,0.9)", "rgba(40,20,50,1)"]}
                    style={{ flex: 1, width: width }}
                  >
                  */

  /*                 {
                    backgroundColor: '#fff',
                    title: 'Onboarding 5',
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
                              source={require("../assets/animaciones/media-ruleta-para-onboarding-15mg.gif")}
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
                                source={require("../assets/images/home/logo_para_boton.png")}
                                style={{
                                  width: 60,
                                  height: 60,
                                }}
                              />
                            </NeuButton>
                          </View>
                    
                         
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
                                  style={{
                                    width: 90,
                                    height: 110,
                                  }}
                                />
                              </NeuButton>
                            </View>
                            {idioma === "spa" ? (
                              <View
                                style={{
                                  flex: 1,
                                  justifyContent: "center",
                                  alignItems: "center",
                                }}
                              >
                                <View style={{ paddingHorizontal: 25 }}>
                                  <View
                                    style={{
                                      flexDirection: "row",
                                      justifyContent: "center",
                                    }}
                                  >
                                    <TextBold
                                      text="El Rayo."
                                      style={{
                                        fontSize: 20,
                                        color: "#fffc00",
                                        textTransform: "uppercase",
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
                            ) : (
                              <View
                                style={{
                                  flex: 1,
                                  justifyContent: "center",
                                  alignItems: "center",
                                }}
                              >
                                <View style={{ paddingHorizontal: 25 }}>
                                  <View
                                    style={{
                                      flexDirection: "row",
                                      justifyContent: "center",
                                    }}
                                  >
                                    <TextBold
                                      text="The Lighting or The Flash"
                                      style={{
                                        fontSize: 20,
                                        color: "#fffc00",
                                        textTransform: "uppercase",
                                      }}
                                    />
                                  </View>
                                  <TextMedium
                                    text="If you’re in a rush here you’ll find the instant recharge. You could include several contacts and even decide who you’re going to send your prize to."
                                    style={{
                                      fontSize: 20,
                                      color: "#fffc00",
                                      textAlign: "center",
                                    }}
                                  />
                                </View>
                              </View>
                            )}
                    
                        </ImageBackground>
                      ),
                    subtitle: 'Done with React Native Onboarding Swiper',
                    title: ""
                  }, */