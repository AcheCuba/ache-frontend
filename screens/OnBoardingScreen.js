import React from "react";
import Onboarding from "react-native-onboarding-swiper";
import { Image, Dimensions, Platform } from "react-native";
import { View } from "react-native";
import { ImageBackground } from "react-native";
import { TextBold, TextMedium } from "../components/CommonText";
import NeuButton from "../libs/neu_element/NeuButton";
import { LinearGradient } from "expo-linear-gradient";
import { Text } from "react-native";
import { GlobalContext } from "../context/GlobalProvider";
import { TouchableOpacity } from "react-native";
import { setIdioma } from "../context/Actions/actions";
import normalize from "react-native-normalize";
import {
  btPremioColor,
  btRecargaColor,
  generalBgColor,
  generalBgColorTrans5,
} from "../constants/commonColors";

const { width, height } = Dimensions.get("screen");

const OnBoardingScreen = ({ navigation }) => {
  const [pageIndex, setPageIndex] = React.useState(0);
  const [showSkip, setShowSkip] = React.useState(false);
  const [selectedIdiom, setSelectedIdiom] = React.useState("eng");

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
          backgroundColor: generalBgColor,
          image: (
            <ImageBackground
              source={require("../assets/images/degradado_general.png")}
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
                    fontSize: normalize(32),
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
                    marginTop: 20,
                    fontSize: normalize(32),
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
          backgroundColor: generalBgColor,
          image: (
            <View style={{}}>
              <ImageBackground
                source={require("../assets/images/degradado_general.png")}
                style={{
                  width: width,
                  height: height,
                  alignItems: "center",
                  //marginTop: 100,
                  zIndex: 10,
                }}
              >
                <Image
                  source={require("../assets/images/logo_amarillo.png")}
                  style={{ width: 120, height: 60, marginTop: 100 }}
                />

                <Image
                  source={require("../assets/images/onboarding/spin_character.png")}
                  style={{ width: 300, height: 300, marginTop: 20 }}
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
                      text="En breve podrás recargar, jugar y ganar premios. Gracias por ser miembro de nuestra comunidad."
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
                      text={`You’re now only one spin away from playing, winning prizes or sending recharges. Thanks for being a part of our community.`}
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
          backgroundColor: generalBgColor,
          image: (
            <ImageBackground
              source={require("../assets/images/degradado_general.png")}
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
                      <TextBold
                        text="ANÍMATE Y GIRA PARA GANAR !!!"
                        style={{
                          fontSize: 20,
                          textAlign: "center",
                          color: "#fffc00",
                        }}
                      />
                    </View>

                    <TextMedium
                      text="Simplemente toca la Rueda de la Fortuna y ¡¡¡Mira cómo gira!!! Si tienes suerte podrías ganar una recarga gratis o incluso mejor ¡¡¡¡el Gran Premio Mensual!!!"
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
                      //top: normalize(height / 6, "height"),
                      top: height / 6,
                    }}
                  >
                    <Image
                      source={require("../assets/animaciones/spin-onboarding.gif")}
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
                      text="¡No creerás lo divertido que puede ser recargar con SPIN!"
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
                      <TextBold
                        text="TAKE A CHANCE AND SPIN TO WIN!!!"
                        style={{
                          //marginTop: 100,
                          fontSize: 20,
                          textAlign: "center",
                          color: "#fffc00",
                        }}
                      />
                    </View>
                    <View>
                      <TextMedium
                        text="Simply touch the Fortune Wheel and watch it Spin !!! and if you get lucky you could be on your way to a free top up or even better the monthly Big Cash Jackpot!!!"
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
                      //top: normalize(height / 6, "height"),
                      top: height / 6,
                    }}
                  >
                    <Image
                      source={require("../assets/animaciones/spin-onboarding.gif")}
                      style={{ width: height / 2.4, height: height / 1.5 }}
                    />
                  </View>
                  <View
                    style={{
                      //marginTop: 100,
                      position: "absolute",
                      bottom: 80,
                      paddingHorizontal: 10,
                    }}
                  >
                    <TextMedium
                      text="You won't believe how much fun recharging can be with SPIN!"
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
          backgroundColor: generalBgColor,
          image: (
            <ImageBackground
              source={require("../assets/images/degradado_general.png")}
              style={{
                width: width,
                height: height,
                alignItems: "center",
              }}
            >
              <View style={{ position: "absolute", left: 0, top: height / 6 }}>
                <Image
                  source={require("../assets/animaciones/spin-onboarding.gif")}
                  style={{ width: height / 2.4, height: height / 1.5 }}
                />
              </View>

              <LinearGradient
                //colors={["rgba(227, 123, 104,0.9)", "rgba(40,20,50,1)"]}
                colors={[generalBgColorTrans5, generalBgColor]}
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
                    color={btPremioColor}
                    width={width / 3.5}
                    height={width / 3.5}
                    borderRadius={width / 7}
                    active={false}
                    onPress={() => {}}
                  >
                    <Image
                      source={require("../assets/images/home/boton_recarga_premio.png")}
                      style={{
                        width: 160,
                        height: 160,
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
                    <View style={{ paddingHorizontal: 20 }}>
                      <Text
                        style={{
                          marginBottom: 30,
                        }}
                      >
                        <TextMedium
                          text="Cuando haces girar la ruleta y ganas un premio, aparecerá en la esquina superior derecha para que lo veas."
                          style={{
                            fontSize: 22,
                            color: "#fffc00",
                            textAlign: "center",
                          }}
                        />
                        <Text> </Text>
                        <Text> </Text>

                        <Image
                          source={require("../assets/images/home/boton_recarga_premio.png")}
                          style={{
                            marginTop: -13,
                            width: 35,
                            height: 35,
                          }}
                        />
                      </Text>

                      <TextMedium
                        text="Sin embargo, para volver a ganar, primero debes utilizar el premio que tienes en ese momento, ya sea añadiéndolo a una recarga o compartiéndolo con un amigo."
                        style={{
                          fontSize: 22,
                          color: "#fffc00",
                          textAlign: "center",
                          marginBottom: 30,
                        }}
                      />
                      <TextMedium
                        text="Una vez hecho esto, puedes volver a jugar, girar la ruleta y probar suerte para conseguir otro premio increíble."
                        style={{
                          fontSize: 22,
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
                    <View style={{ paddingHorizontal: 20 }}>
                      <Text
                        style={{
                          marginBottom: 30,
                        }}
                      >
                        <TextMedium
                          text="When you hit the wheel and secure a prize, it will be displayed in the top right hand corner for you to see!"
                          style={{
                            fontSize: 22,
                            color: "#fffc00",
                            textAlign: "center",
                          }}
                        />
                        <Text> </Text>
                        <Text> </Text>

                        <Image
                          source={require("../assets/images/home/boton_recarga_premio.png")}
                          style={{
                            marginTop: -13,
                            width: 35,
                            height: 35,
                          }}
                        />
                      </Text>

                      <TextMedium
                        text="However, in order to win again, you must first use the prize you currently have - either by recharging or sharing it with a friend."
                        style={{
                          fontSize: 22,
                          color: "#fffc00",
                          textAlign: "center",
                          marginBottom: 30,
                        }}
                      />
                      <TextMedium
                        text="Once done, you can jump back into the action, spin the wheel, and try your luck for another amazing win!"
                        style={{
                          fontSize: 22,
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
        {
          backgroundColor: generalBgColor,
          image: (
            <ImageBackground
              source={require("../assets/images/degradado_general.png")}
              style={{
                width: width,
                height: height,
                alignItems: "center",
              }}
            >
              <View style={{ position: "absolute", left: 0, top: height / 6 }}>
                <Image
                  source={require("../assets/animaciones/spin-onboarding.gif")}
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
                  color={btPremioColor}
                  width={width / 3.5}
                  height={width / 3.5}
                  borderRadius={width / 7}
                  active={false}
                  onPress={() => {}}
                >
                  <Image
                    source={require("../assets/images/home/boton_recarga_premio.png")}
                    style={{
                      width: 160,
                      height: 160,
                    }}
                  />
                </NeuButton>
              </View>

              <LinearGradient
                //colors={["rgba(227, 123, 104,0.9)", "rgba(40,20,50,1)"]}
                colors={[generalBgColor, generalBgColorTrans5]}
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
                    color={btRecargaColor}
                    width={width / 3.5}
                    height={width / 3.5}
                    borderRadius={width / 7}
                    active={false}
                    onPress={() => {}}
                  >
                    {/* <Image
                      source={require("../assets/animaciones/moneda-recarga-rapida.gif")}
                      style={{
                        width: 130,
                        height: 150,
                      }}
                    /> */}
                    <Image
                      source={require("../assets/images/home/boton_recarga_directa.png")}
                      style={{
                        width: 160,
                        height: 160,
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
                          text="The Lightening"
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
