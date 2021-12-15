import React from "react";
import { Image } from "react-native";
import { Text, View, Button, Dimensions } from "react-native";
import CommonNeuButton from "../../components/CommonNeuButton";

const { width } = Dimensions.get("screen");

const PagoCompletadoScreen = ({ navigation }) => {
  return (
    <View
      style={{
        flex: 1,
        //justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#701c57",
      }}
    >
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
        <Text
          style={{
            fontSize: 20,
            fontWeight: "bold",
            color: "#01f9d2",
            textTransform: "uppercase",
          }}
        >
          ¡Recarga Exitosa!
        </Text>
      </View>

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
  );
};

export default PagoCompletadoScreen;
