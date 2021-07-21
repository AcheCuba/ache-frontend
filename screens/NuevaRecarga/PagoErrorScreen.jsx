import React from "react";
import { Text, View, Dimensions } from "react-native";
import CommonNeuButton from "../../components/CommonNeuButton";

const { width } = Dimensions.get("screen");

const PagoErrorScreen = ({ navigation }) => {
  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#701c57"
      }}
    >
      <View style={{ paddingHorizontal: 30 }}>
        <Text
          style={{
            fontSize: 20,
            fontWeight: "bold",
            color: "#01f9d2",
            textAlign: "center"
          }}
        >
          No se pudo completar el pago, su dinero será reembolsado
        </Text>
      </View>

      <View style={{ marginTop: 25 }}>
        <CommonNeuButton
          text="Ir a Inicio"
          onPress={() => {
            navigation.navigate("Juego");
          }}
          screenWidth={width}
        />
      </View>
    </View>
  );
};

export default PagoErrorScreen;
