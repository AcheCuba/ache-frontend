import React from "react";
import Onboarding from "react-native-onboarding-swiper";
import { Image, Dimensions } from "react-native";
import { View } from "react-native";
import { ImageBackground } from "react-native";
import { TextBold, TextMedium } from "../components/CommonText";
import { NeuButton } from "react-native-neu-element";
import { LinearGradient } from "expo-linear-gradient";
import { Text } from "react-native";
import { GlobalContext } from "../context/GlobalProvider";
import { TouchableOpacity } from "react-native";
import { duration } from "moment";
import { setIdioma } from "../context/Actions/actions";

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
      skipLabel={idioma == "eng" ? "skip" : "omitir"}
      imageContainerStyles={{ paddingBottom: 0 }}
      containerStyles={{}}
      pageIndexCallback={getPageIndex}
      bottomBarHighlight={true}
      bottomBarHeight={50}
      pages={[
        {
          backgroundColor: "rgb(45,22,56)",
          image: (
            <ImageBackground
              source={require("../assets/images/degradado_home.png")}
              style={{
                width: width,
                height: height,
                alignItems: "center",
                justifyContent: "center",
                //marginTop: 100,
                zIndex: 10,
              }}
            >
              <TouchableOpacity
                onPress={() => {
                  userDispatch(setIdioma("eng"));
                  setSelectedIdiom("eng");
                }}
              >
                <TextBold
                  text="English"
                  style={{
                    marginTop: 60,
                    fontSize: 40,
                    color:
                      selectedIdiom == "eng"
                        ? "rgba(255, 251, 0, 1)"
                        : "rgba(255, 251, 0, 0.3)",
                    textTransform: "uppercase",
                  }}
                />
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => {
                  userDispatch(setIdioma("spa"));
                  setSelectedIdiom("spa");
                }}
              >
                <TextBold
                  text="Spanish"
                  style={{
                    marginTop: 60,
                    fontSize: 40,
                    color:
                      selectedIdiom === "spa"
                        ? "rgba(255, 251, 0, 1)"
                        : "rgba(255, 251, 0, 0.3)",
                    textTransform: "uppercase",
                  }}
                />
              </TouchableOpacity>
            </ImageBackground>
          ),
          title: "",
          subtitle: "",
        },
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

                {idioma == "spa" ? (
                  <>
                    <TextBold
                      text="Bienvenid@"
                      style={{
                        marginTop: 60,
                        fontSize: 40,
                        color: "#fffb00",
                        textTransform: "uppercase",
                      }}
                    />
                    <TextMedium
                      text="¡Ya tienes ACHÉ! En breve podrás recargar, jugar y ganar premios. Gracias por ser miembro de nuestra comunidad."
                      style={{
                        marginTop: 20,
                        fontSize: 20,
                        textAlign: "center",
                        color: "#fffb00",
                        marginHorizontal: 80,

                        //textTransform: "uppercase",
                      }}
                    />
                  </>
                ) : (
                  <>
                    <TextBold
                      text="Welcome"
                      style={{
                        marginTop: 15,
                        fontSize: 40,
                        color: "#fffb00",
                        textTransform: "uppercase",
                      }}
                    />
                    <TextMedium
                      text={`You now have ACHE! ACHÉ is an Afro-Cuban word for good luck, and that is the positive energy we wish you while connecting with  your friends and family in Cuba. You’re now only one spin away from playing, winning prizes or sending recharges. Thanks you being a member of our community.`}
                      style={{
                        marginTop: 10,
                        fontSize: 20,
                        textAlign: "center",
                        color: "#fffb00",
                        marginHorizontal: 45,

                        //textTransform: "uppercase",
                      }}
                    />
                  </>
                )}
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
              {idioma === "spa" ? (
                <>
                  <View
                    style={{
                      position: "absolute",
                      top: 80,
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
                    style={{ position: "absolute", left: 0, top: height / 6 }}
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
                      top: 60,
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
                    style={{ position: "absolute", left: 0, top: height / 6 }}
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
                  source={require("../assets/animaciones/media-ruleta-para-onboarding-15mg.gif")}
                  style={{ width: height / 2.4, height: height / 1.5 }}
                />
              </View>

              <LinearGradient
                colors={["rgba(227, 123, 104,0.9)", "rgba(40,20,50,1)"]}
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
                      source={require("../assets/images/home/logo_para_boton.png")}
                      style={{
                        width: 60,
                        height: 60,
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
                          text="El Aché"
                          style={{
                            fontSize: 20,
                            color: "#fffc00",
                            textTransform: "uppercase",
                          }}
                        />
                      </View>
                      <Text>
                        <TextMedium
                          text="Cada premio que ganes lo encontrarás aquí. Cuando tengas un premio pendiente envíalo para poder obtener otro al girar la"
                          style={{
                            fontSize: 20,
                            color: "#fffc00",
                            textAlign: "center",
                          }}
                        />
                        <TextBold
                          text=" Ruleta."
                          style={{
                            fontSize: 20,
                            color: "#fffc00",
                          }}
                        />
                      </Text>
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
                          text="ACHÉ Button"
                          style={{
                            fontSize: 20,
                            color: "#fffc00",
                            textTransform: "uppercase",
                          }}
                        />
                      </View>
                      <Text>
                        <TextMedium
                          text="Here’s where you’ll find the amount you win. Whenever you have a prize on hold send it to win another by spinning the "
                          style={{
                            fontSize: 20,
                            color: "#fffc00",
                            textAlign: "center",
                          }}
                        />
                        <TextBold
                          text="Wheel."
                          style={{
                            fontSize: 20,
                            color: "#fffc00",
                          }}
                        />
                      </Text>
                    </View>
                  </View>
                )}
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

              <LinearGradient
                colors={["rgba(227, 123, 104,0.9)", "rgba(40,20,50,1)"]}
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
