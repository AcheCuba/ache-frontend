import React from "react";
import { Image } from "react-native";
import { Text, View, Dimensions, ImageBackground } from "react-native";
import CommonNeuButton from "../../components/CommonNeuButton";
import { TextBold } from "../../components/CommonText";

const { width } = Dimensions.get("screen");

const PagoCompletadoScreen = ({ navigation }) => {
  return (
    <ImageBackground
      source={require("../../assets/images/degradado_general.png")}
      style={{
        width: "100%",
        height: "100%",
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
      }}
      transition={false}
    >
      <View style={{ flex: 1, width: "100%" }}>
        <View
          style={{
            width: "100%",
            justifyContent: "center",
            alignItems: "center",
            marginTop: 100,
          }}
        >
          <Image
            source={require("../../assets/animaciones/moneda_check.gif")}
            style={{
              width: width / 1.5,
              height: width / 1.5,
            }}
          />
        </View>
        <View
          style={{
            width: "100%",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <TextBold
            text="¡Recarga Exitosa!"
            style={{
              fontSize: 24,
              fontWeight: "bold",
              color: "#01f9d2",
              textTransform: "uppercase",
            }}
          />
        </View>

        <View style={{ width: "100%", alignItems: "center" }}>
          <View style={{ marginTop: 50 }}>
            <CommonNeuButton
              text="Jugar"
              onPress={() => {
                navigation.navigate("Juego");
              }}
              screenWidth={width}
            />
          </View>
          <View style={{ marginTop: 40 }}>
            <CommonNeuButton
              text="Atrás"
              onPress={() => {
                navigation.jumpTo("Nueva Recarga", {
                  screen: "NuevaRecargaScreen",
                  params: { inOrderToCobrarPremio: false },
                });
              }}
              screenWidth={width}
            />
          </View>
        </View>
      </View>
    </ImageBackground>
  );
};

export default PagoCompletadoScreen;
