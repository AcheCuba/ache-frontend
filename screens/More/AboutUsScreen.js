import React from "react";
import { Dimensions } from "react-native";
import { ImageBackground } from "react-native";
import { Linking, StyleSheet, Text, View } from "react-native";
import { ScrollView } from "react-native-gesture-handler";
import CommonHeader from "../../components/CommonHeader";
import { TextBold, TextItalic } from "../../components/CommonText";
import {
  MoreNosotrosTextEnglish,
  MoreNosotrosTextSpanish,
} from "../../constants/Texts";
import { GlobalContext } from "../../context/GlobalProvider";

const { width, height } = Dimensions.get("screen");
const marginGlobal = width / 10;

const AboutUsScreen = ({ navigation }) => {
  const { userState } = React.useContext(GlobalContext);

  const ResolveText = (site) => {
    const idioma = userState?.idioma;
    const textSpa = MoreNosotrosTextSpanish();
    const textEng = MoreNosotrosTextEnglish();

    if (idioma === "spa") {
      return textSpa[site];
    }

    if (idioma === "eng") {
      return textEng[site];
    }
  };

  /* React.useEffect(() => {
    const unsubs = navigation.addListener("beforeRemove", (e) => {
      e.preventDefault();
    });
    return unsubs;
  }, [navigation]); */

  return (
    <>
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
                  text={ResolveText("quienesSomosTitle")}
                />
                <TextItalic
                  style={{
                    fontSize: 20,
                    color: "#eee",
                    textAlign: "left",
                  }}
                  text={ResolveText("quienesSomosBody")}
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
                  text={ResolveText("queNosDistingueTitle")}
                />
                <TextItalic
                  style={{
                    fontSize: 20,
                    color: "#eee",
                    textAlign: "left",
                  }}
                  text={ResolveText("queNosDistingueBody")}
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
                  text={ResolveText("acheTitle")}
                />
                <TextItalic
                  style={{
                    fontSize: 20,
                    color: "#eee",
                    textAlign: "left",
                  }}
                  text={ResolveText("acheBody")}
                />
              </View>

              {/* <Text style={styles.title}>
                Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
                eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut
                enim ad minim veniam, quis nostrud exercitation ullamco laboris
                nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor
                in reprehenderit in voluptate velit esse cillum dolore eu fugiat
                nulla pariatur. Excepteur sint occaecat cupidatat non proident,
                sunt in culpa qui officia deserunt mollit anim id est laborum.
                {"\n"} {"\n"}
                Sed ut perspiciatis unde omnis iste natus error sit voluptatem
                accusantium doloremque laudantium, totam rem aperiam, eaque ipsa
                quae ab illo inventore veritatis et quasi architecto beatae
                vitae dicta sunt explicabo.
              </Text> */}
              {/*  <View style={{ alignItems: "flex-end" }}>
                <Text
                  style={{
                    color: "#fff800",
                    fontSize: 20,
                    fontWeight: "bold",
                    marginTop: 10,
                  }}
                  onPress={() => Linking.openURL("http://google.com")}
                >
                  ... Saber más
                </Text>
              </View> */}
            </ScrollView>
          </View>
        </View>
      </ImageBackground>
    </>
  );
};

export default AboutUsScreen;

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
