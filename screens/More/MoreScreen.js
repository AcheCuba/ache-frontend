import * as React from "react";
import { ImageBackground } from "react-native";
import { Image } from "react-native";
import { StyleSheet, Text, View, Dimensions } from "react-native";
import CommonNeuButton from "../../components/CommonNeuButton";

const { width, height } = Dimensions.get("screen");
//const marginGlobal = width / 10;

const MoreScreen = ({ navigation }) => {
  return (
    <ImageBackground
      source={require("../../assets/images/degradado_general.png")}
      style={{
        width: "100%",
        height: "100%",
        flex: 1,
        justifyContent: "center",
      }}
      transition={false}
    >
      <View
        style={{
          paddingTop: 60,
          width: width,
          height: height / 6,
          //backgroundColor: "rgba(112, 28, 87, 1)",
          flexDirection: "row",
          justifyContent: "flex-start",
        }}
      >
        <Image
          source={require("../../assets/images/more/asset3.png")}
          //resizeMode="center"
          style={{
            marginLeft: width / 10,
            width: width / 4.5,
            height: width / 8.6,
          }}
        />
      </View>
      <View style={styles.containerButtons}>
        <View style={styles.buttons}>
          <CommonNeuButton
            text="Sobre Nosotros"
            screenWidth={width}
            onPress={() => navigation.navigate("AboutUsScreen")}
          />
        </View>
        <View style={styles.buttons}>
          <CommonNeuButton
            text="Premios"
            screenWidth={width}
            onPress={() => navigation.navigate("PremioScreen")}
          />
        </View>
        <View style={styles.buttons}>
          <CommonNeuButton
            text="Política de privacidad"
            screenWidth={width}
            onPress={() => navigation.navigate("PrivacidadScreen")}
          />
        </View>
        <View style={styles.buttons}>
          <CommonNeuButton
            text="Términos de uso"
            screenWidth={width}
            onPress={() => navigation.navigate("TermUsoScreen")}
          />
        </View>
        <View style={styles.buttons}>
          <CommonNeuButton
            text="Modo de uso"
            screenWidth={width}
            onPress={() => navigation.navigate("ModoUsoScreen")}
          />
        </View>
      </View>
    </ImageBackground>
  );
};

export default MoreScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "rgba(112, 28, 87, 1)",
    justifyContent: "center",
  },
  containerButtons: {
    flex: 1,
    marginTop: "5%",
    alignItems: "center",
  },
  buttons: {
    marginTop: 30,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
  },
});
