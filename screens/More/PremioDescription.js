import React from "react";
import { Dimensions } from "react-native";
import { ImageBackground } from "react-native";
import { StyleSheet, View } from "react-native";
import CommonNeuButton from "../../components/CommonNeuButton";
import { TextBold, TextItalic } from "../../components/CommonText";
import { GlobalContext } from "../../context/GlobalProvider";

const { width, height } = Dimensions.get("screen");
const marginGlobal = width / 10;

const PremioDescription = ({ navigation, route }) => {
  const { type, description } = route.params;
  const { userState } = React.useContext(GlobalContext);
  const idioma = userState?.idioma;

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
      <View style={styles.container}>
        <View style={{ flex: 1, marginTop: 250 }}>
          <View style={{ alignItems: "center" }}>
            <TextBold
              style={{
                textTransform: "uppercase",
                fontSize: 22,
                color: "#fff800",
              }}
              text={type}
            />
          </View>

          <View style={{ marginTop: 30, paddingHorizontal: 20 }}>
            <TextItalic
              style={{
                fontSize: 20,
                color: "#01f9d2",
                textAlign: "left",
              }}
              text={description}
            />
          </View>

          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-around",
              //position: "absolute",
              marginTop: 50,
            }}
          >
            <CommonNeuButton
              text={idioma === "spa" ? "Jugar" : "Play"}
              screenWidth={width}
              width={width / 3}
              color={type === "calavera" ? "#6b1b54" : "#611951"}
              onPress={() => {
                navigation.navigate("Juego");
              }}
            />
            <CommonNeuButton
              text={idioma === "spa" ? "Atrás" : "Back"}
              width={width / 3}
              screenWidth={width}
              color={type === "calavera" ? "#6b1b54" : "#611951"}
              onPress={() => {
                navigation.navigate("PremioScreen");
              }}
            />
          </View>
        </View>
      </View>
    </ImageBackground>
  );
};

export default PremioDescription;

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
