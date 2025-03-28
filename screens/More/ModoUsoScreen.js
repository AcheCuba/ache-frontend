import React from "react";
import { Dimensions, Platform } from "react-native";
import { ImageBackground } from "react-native";
import { StyleSheet, View } from "react-native";
import { ScrollView } from "react-native-gesture-handler";
import CommonHeader from "../../components/CommonHeader";
import { TextBold, TextItalic } from "../../components/CommonText";
import { infoTextColor } from "../../constants/commonColors";
import {
  ModoDeUsoTextEnglishAndroid,
  ModoDeUsoTextEnglishIos,
  ModoDeUsoTextSpanishAndroid,
  ModoDeUsoTextSpanishIos,
} from "../../constants/Texts";
import { GlobalContext } from "../../context/GlobalProvider";

const { width, height } = Dimensions.get("screen");
const marginGlobal = width / 10;

const ModoUsoScreen = ({ navigation }) => {
  const { userState } = React.useContext(GlobalContext);

  const ResolveText = (site) => {
    const idioma = userState?.idioma;
    let textSpa;
    let textEng;

    if (Platform.OS === "ios") {
      textSpa = ModoDeUsoTextSpanishIos();
      textEng = ModoDeUsoTextEnglishIos();
    }

    if (Platform.OS === "android") {
      textSpa = ModoDeUsoTextSpanishAndroid();
      textEng = ModoDeUsoTextEnglishAndroid();
    }

    if (idioma === "spa") {
      return textSpa[site];
    }

    if (idioma === "eng") {
      return textEng[site];
    }
  };
  return (
    <ImageBackground
      source={require("../../assets/images/degradado_general.png")}
      style={{
        width: "100%",
        height: "100%",
        flex: 1,
        //justifyContent: "center",
      }}
      transition={false}
    >
      <CommonHeader
        width={width}
        height={height}
        _onPress={() => navigation.navigate("MoreScreen")}
      />
      <View
        style={{
          flex: 1,
          alignItems: "center",
        }}
      >
        <View style={styles.container}>
          <View
            style={{
              flex: 1,
              marginTop: 10,
              marginBottom: 105,
              marginHorizontal: 20,
            }}
          >
            <View style={{ marginBottom: 20, alignItems: "center" }}>
              <TextBold
                style={{
                  fontSize: 22,
                  textTransform: "uppercase",
                  color: infoTextColor,
                  marginBottom: 5,
                }}
                text={
                  userState.idioma === "spa"
                    ? "REGLAS OFICIALES DE SPIN"
                    : "OFFICIAL RULES OF SPIN"
                }
              />
            </View>
            <ScrollView showsVerticalScrollIndicator={false}>
              <View style={{ marginBottom: 20 }}>
                <TextBold
                  style={{
                    fontSize: 20,
                    textTransform: "uppercase",
                    color: infoTextColor,
                    marginBottom: 5,
                  }}
                  text={ResolveText("juega")}
                />
                <TextItalic
                  style={{
                    fontSize: 20,
                    color: infoTextColor,
                    textAlign: "left",
                  }}
                  text={ResolveText("juegaDesc")}
                />
              </View>
              <View style={{ marginBottom: 20 }}>
                <TextBold
                  style={{
                    fontSize: 20,
                    textTransform: "uppercase",
                    color: infoTextColor,
                    marginBottom: 5,
                  }}
                  text={ResolveText("recarga")}
                />
                <TextItalic
                  style={{
                    fontSize: 20,
                    color: infoTextColor,
                    textAlign: "left",
                  }}
                  text={ResolveText("recargaDesc")}
                />
              </View>
              <View style={{ marginBottom: 20 }}>
                <TextBold
                  style={{
                    fontSize: 20,
                    textTransform: "uppercase",
                    color: infoTextColor,
                    marginBottom: 5,
                  }}
                  text={ResolveText("premios")}
                />
                <TextItalic
                  style={{
                    fontSize: 20,
                    color: infoTextColor,
                    textAlign: "left",
                  }}
                  text={ResolveText("premiosDesc")}
                />
              </View>
              <View style={{ marginBottom: 20 }}>
                <TextBold
                  style={{
                    fontSize: 20,
                    textTransform: "uppercase",
                    color: infoTextColor,
                    marginBottom: 5,
                  }}
                  text={ResolveText("tiempo")}
                />
                <TextItalic
                  style={{
                    fontSize: 20,
                    color: infoTextColor,
                    textAlign: "left",
                  }}
                  text={ResolveText("tiempoDesc")}
                />
              </View>
              <View style={{ marginBottom: 20 }}>
                <TextBold
                  style={{
                    fontSize: 20,
                    textTransform: "uppercase",
                    color: infoTextColor,
                    marginBottom: 5,
                  }}
                  text={ResolveText("origen")}
                />
                <TextItalic
                  style={{
                    fontSize: 20,
                    color: infoTextColor,
                    textAlign: "left",
                  }}
                  text={ResolveText("origenDesc")}
                />
              </View>

              {Platform.OS === "ios" ? (
                <View style={{ marginBottom: 20 }}>
                  <TextBold
                    style={{
                      fontSize: 20,
                      textTransform: "uppercase",
                      color: infoTextColor,
                      marginBottom: 5,
                    }}
                    text={ResolveText("consultas")}
                  />
                  <TextItalic
                    style={{
                      fontSize: 20,
                      color: infoTextColor,
                      textAlign: "left",
                    }}
                    text={ResolveText("consultasDesc")}
                  />
                </View>
              ) : null}
            </ScrollView>
          </View>
        </View>
      </View>
    </ImageBackground>
  );
};

export default ModoUsoScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    //backgroundColor: "rgba(112, 28, 87, 1)",
    marginHorizontal: marginGlobal,
  },
  /* title: {
    fontSize: 20,
    //fontWeight: "bold",
    fontStyle: "italic",
    color: "#eee",
  }, */
});
