import React from "react";
import { Dimensions, Linking, TouchableOpacity } from "react-native";
import { ImageBackground } from "react-native";
import { StyleSheet, Text, View } from "react-native";
import { ScrollView } from "react-native-gesture-handler";
import CommonHeader from "../../components/CommonHeader";
import { TextMedium } from "../../components/CommonText";
import { infoTextColor } from "../../constants/commonColors";
import { GlobalContext } from "../../context/GlobalProvider";

const { width, height } = Dimensions.get("screen");
const marginGlobal = width / 10;

const TermUsoScreen = ({ navigation }) => {
  const { userState } = React.useContext(GlobalContext);
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
            <ScrollView showsVerticalScrollIndicator={false}>
              {userState?.idioma === "spa" ? (
                <TouchableOpacity
                  activeOpacity={0.75}
                  onPress={() =>
                    Linking.openURL(
                      "https://spinrecargas.com/?page_id=2227&lang=es"
                    )
                  }
                >
                  <TextMedium
                    text={"Más sobre nuestros términos de uso"}
                    style={{
                      color: infoTextColor,
                      textDecorationLine: "underline",
                      fontSize: 20,
                    }}
                  />
                </TouchableOpacity>
              ) : (
                <TouchableOpacity
                  activeOpacity={0.75}
                  onPress={() =>
                    Linking.openURL("https://spinrecargas.com/?page_id=2217")
                  }
                >
                  <TextMedium
                    text={"More about our terms of use"}
                    style={{
                      color: infoTextColor,
                      textDecorationLine: "underline",
                      fontSize: 20,
                    }}
                  />
                </TouchableOpacity>
              )}
            </ScrollView>
          </View>
        </View>
      </View>
    </ImageBackground>
  );
};

export default TermUsoScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    //backgroundColor: "rgba(112, 28, 87, 1)",
    marginHorizontal: marginGlobal,
  },
  textInfo: {
    fontSize: 20,
    //fontWeight: "bold",
    fontStyle: "italic",
    color: infoTextColor,
  },
});
