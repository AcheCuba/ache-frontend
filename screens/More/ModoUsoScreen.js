import React from "react";
import { Dimensions } from "react-native";
import { ImageBackground } from "react-native";
import { Linking, StyleSheet, Text, View } from "react-native";
import { ScrollView } from "react-native-gesture-handler";
import CommonHeader from "../../components/CommonHeader";
import { TextBold, TextItalic } from "../../components/CommonText";
import {
  ModoDeUsoTextEnglish,
  ModoDeUsoTextSpanish,
} from "../../constants/Texts";
import { GlobalContext } from "../../context/GlobalProvider";

const { width, height } = Dimensions.get("screen");
const marginGlobal = width / 10;

const ModoUsoScreen = ({ navigation }) => {
  const { userState } = React.useContext(GlobalContext);

  const ResolveText = (site) => {
    const idioma = userState?.idioma;
    const textSpa = ModoDeUsoTextSpanish();
    const textEng = ModoDeUsoTextEnglish();

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
          //backgroundColor: "rgba(112, 28, 87, 1)",
        }}
      >
        <View style={styles.container}>
          <View style={{ flex: 1, marginVertical: 10, marginHorizontal: 20 }}>
            <ScrollView>
              <View style={{ marginBottom: 20 }}>
                <TextBold
                  style={{
                    fontSize: 20,
                    textTransform: "uppercase",
                    color: "#eee",
                    marginBottom: 5,
                  }}
                  text={ResolveText("juega")}
                />
                <TextItalic
                  style={{
                    fontSize: 20,
                    color: "#eee",
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
                    color: "#eee",
                    marginBottom: 5,
                  }}
                  text={ResolveText("recarga")}
                />
                <TextItalic
                  style={{
                    fontSize: 20,
                    color: "#eee",
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
                    color: "#eee",
                    marginBottom: 5,
                  }}
                  text={ResolveText("premios")}
                />
                <TextItalic
                  style={{
                    fontSize: 20,
                    color: "#eee",
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
                    color: "#eee",
                    marginBottom: 5,
                  }}
                  text={ResolveText("tiempo")}
                />
                <TextItalic
                  style={{
                    fontSize: 20,
                    color: "#eee",
                    textAlign: "left",
                  }}
                  text={ResolveText("tiempoDesc")}
                />
              </View>
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
  title: {
    fontSize: 20,
    //fontWeight: "bold",
    fontStyle: "italic",
    color: "#eee",
  },
});
